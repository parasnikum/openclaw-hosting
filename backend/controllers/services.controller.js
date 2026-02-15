
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { encryptEnvValue, decryptEnvValue } = require("../utils/encryption")
/**
 * CREATE SERVICE (Purchase/Initialize)
 */
async function getAvailableNode() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT 
        n.node_id, n.ip, n.port, n.max_servers, 
        COUNT(s.id) AS allocated_servers
      FROM nodes n
      LEFT JOIN servers s
        ON s.on_node = n.node_id
        AND s.status = 'Active'
      WHERE n.allowed = TRUE
      GROUP BY n.node_id, n.ip, n.port, n.max_servers
      HAVING (n.max_servers - COUNT(s.id)) > 0
      ORDER BY (n.max_servers - COUNT(s.id)) DESC
      LIMIT 1
    `);

    if (rows.length === 0) {
      throw new Error("No available nodes with free slots.");
    }

    return rows[0]; // { node_id, ip, port, max_ss, allocated_servers }
  } finally {
    client.release();
  }
}


exports.createService = async (req, res) => {
  const client = await pool.connect();

  try {
    const { service_name, plan_id, config, payment_mode } = req.body;
    console.log(JSON.stringify(req.body));

    const user_id = req.user.userid;

    // 1. Fetch plan (single source of truth)
    const planRes = await client.query(
      "SELECT id, price FROM plans WHERE id = $1",
      [plan_id]
    );
    if (planRes.rows.length === 0)
      return res.status(404).json({ msg: "Plan not found" });

    const plan = planRes.rows[0];

    // 2. Pick target node
    const nodeRes = await client.query(
      `SELECT node_id
       FROM nodes
       WHERE allowed = TRUE
       ORDER BY max_servers ASC
       LIMIT 1`
    );

    if (nodeRes.rows.length === 0)
      return res.status(507).json({ msg: "No infrastructure nodes available" });

    const targetNode = nodeRes.rows[0].node_id;

    await client.query("BEGIN");

    // 3. Create Service
    const serviceId = uuidv4();
    await client.query(
      `INSERT INTO services (id, service_name, plan_id, user_id, purchased_on, renewal_date, status, category)
   VALUES ($1, $2, $3, $4, NOW(), NOW() + INTERVAL '30 days', 'Provisioning', 'openclaw')`,
      [serviceId, service_name, plan_id, user_id]
    );

    const serverId = uuidv4();
    await client.query(
      `INSERT INTO servers (id, server_name, service_id, on_node, ip, port, status)
   VALUES ($1, $2, $3, $4, $5, $6, 'Provisioning')`,
      [serverId, service_name, serviceId, targetNode, targetNode.ip, '3000']
    );

    // 5. Save environment & overrides ONLY
    if (config.env && config.env.ai_credentials) {
      const credentials = config.env.ai_credentials; // This is the [{provider, apiKey}] array

      for (const item of credentials) {
        // We format the name: e.g., "OPENAI_API_KEY"
        const envName = `${item.provider.toUpperCase().replace(/-/g, '_')}_API_KEY`;
        const encryptedValue = encryptEnvValue(item.apiKey);

        await client.query(
          `INSERT INTO envs (env_id, service_id, name, value)
       VALUES ($1, $2, $3, $4)`,
          [uuidv4(), serviceId, envName, encryptedValue]
        );
      }
    }

    async function upsertEnv(name, value) {
      const encryptedValue = encryptEnvValue(value);
      await client.query(
        `INSERT INTO envs (env_id, service_id, name, value)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (service_id, name)
     DO UPDATE SET value = EXCLUDED.value`,
        [uuidv4(), serviceId, name, encryptedValue]
      );
    }

    if (config?.env?.ai_credentials?.length) {
      for (const item of config.env.ai_credentials) {
        if (!item.provider || !item.apiKey) continue;
        const envName = `${item.provider.toUpperCase().replace(/-/g, "_")}_API_KEY`;
        await upsertEnv(envName, item.apiKey);
      }
    }

    if (config?.env?.channels) {
      const channels = config.env.channels;

      const slack = channels["slack-socket"] || channels["slack-http"];
      if (slack?.botToken) await upsertEnv("SLACK_BOT_TOKEN", slack.botToken);
      if (slack?.appToken) await upsertEnv("SLACK_APP_TOKEN", slack.appToken);
      if (channels["discord"]?.token) await upsertEnv("DISCORD_BOT_TOKEN", channels["discord"].token);
      if (channels["telegram"]?.botToken) await upsertEnv("TELEGRAM_BOT_TOKEN", channels["telegram"].botToken);
      if (channels["whatsapp"]) await upsertEnv("WHATSAPP", channels["whatsapp"].allowFrom);
    }

    for (const [name, value] of Object.entries(config.env)) {
      if (["ai_credentials", "channels"].includes(name)) continue;

      const safeValue = typeof value === "string" ? value : JSON.stringify(value);
      await upsertEnv(name.toUpperCase(), safeValue);
    }



    // 6. Invoice
    const invoiceId = uuidv4();
    await client.query(
      `INSERT INTO invoices
       (id, service_id, user_id, price, status, expiry_date)
       VALUES ($1, $2, $3, $4, 'Paid', NOW() + INTERVAL '30 days')`,
      [invoiceId, serviceId, user_id, plan.price]
    );

    // 7. Transaction
    await client.query(
      `INSERT INTO transactions
       (transaction_id, service_id, user_id, price, payment_mode, status, order_id)
       VALUES ($1, $2, $3, $4, $5, 'Paid', $6)`,
      [uuidv4(), serviceId, user_id, plan.price, payment_mode, `ORDER-${Date.now()}`]
    );
    const subdomain = `${uuidv4().split("-")[0]}-openclaw`;

    // 7. Domain
    await client.query(
      `INSERT INTO project_domains
       (id, service_id, domain_type, hostname, ssl_enabled, ssl_status)
       VALUES ($1, $2, $3, $4, $5,$6)`,
      [uuidv4(), serviceId, "subdomain", subdomain, true, `Provisioning`]
    );

    await client.query("COMMIT");

    const node = await getAvailableNode();

    // Send success immediately
    res.status(201).json({
      status: "Success",
      msg: `Service created successfully. Provisioning has started.`,
      serviceId,
      node: { ip: node.ip, port: node.port }
    });

    // 🔥 Run build in background (do not await)
    (async () => {
      try {
        const node = await getAvailableNode();

        const response = await fetch(
          `http://${node.ip}:${node.port}/api/services/${serviceId}/build`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category: "openclaw", config: config })
          }
        );

        if (!response.ok) {
          const err = await response.text();
          console.error("Background build failed:", err);

          await pool.query(
            `UPDATE services SET status = 'Failed' WHERE id = $1`,
            [serviceId]
          );

          return;
        }

        await pool.query(
          `UPDATE services SET status = 'Active' WHERE id = $1`,
          [serviceId]
        );

      } catch (err) {
        console.error("Background build error:", err);

        await pool.query(
          `UPDATE services SET status = 'Build Failed' WHERE id = $1`,
          [serviceId]
        );
      }
    })();

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Provisioning Error:", error);
    return res.status(500).json({
      error: "Provisioning failed",
      details: error.message,
    });
  } finally {
    client.release();
  }
};

/**
 * UPDATE SERVICE CONFIG (Env Vars & Config)
 */
exports.updateServiceConfig = async (req, res) => {
  try {
    const { service_id } = req.params;
    const { env_vars, config } = req.body;
    const user_id = req.user.userid;

    // Ensure user owns the service
    const ownershipCheck = await pool.query('SELECT id FROM services WHERE id = $1 AND user_id = $2', [service_id, user_id]);
    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ msg: "Unauthorized or Service not found." });
    }

    // Update Envs table
    await pool.query(
      `UPDATE envs SET env_vars = $1, config = $2 WHERE service_id = $3`,
      [JSON.stringify(env_vars), JSON.stringify(config), service_id]
    );

    return res.status(200).json({ status: "Success", msg: "Configuration updated." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * GET USER SERVICES (List View)
 */
exports.getUserServices = async (req, res) => {
  try {
    const user_id = req.user.userid;
    // Join with plans to show plan name and price in the list
    const query = `
            SELECT s.*, p.plan_name, p.price, p.category 
            FROM services s
            JOIN plans p ON s.plan_id = p.id
            WHERE s.user_id = $1
            ORDER BY s.purchased_on DESC
        `;

    const result = await pool.query(query, [user_id]);
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getServiceDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userid;

    const serviceQuery = `
      SELECT s.*, p.plan_name, p.config AS plan_config
      FROM services s
      JOIN plans p ON s.plan_id = p.id
      WHERE s.id = $1 AND s.user_id = $2
    `;

    const envQuery = `
      SELECT name, value
      FROM envs
      WHERE service_id = $1
    `;
    const serverQuery = `
      SELECT hostname
      FROM servers
      WHERE service_id = $1
    `;

    const domainQuery = `
            SELECT hostname
            FROM project_domains
            WHERE service_id = $1
    `

    const serviceResult = await pool.query(serviceQuery, [id, user_id]);

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ msg: "Service not found." });
    }

    const service = serviceResult.rows[0];
    service.env = {};

    const envResult = await pool.query(envQuery, [id]);

    for (const row of envResult.rows) {
      try {
        service.env[row.name] = decryptEnvValue(row.value);
      } catch {
        service.env[row.name] = null;
      }
    }

    const domainResult = await pool.query(domainQuery, [id]);
    service.hostname = `http://${domainResult.rows[0].hostname}.localhost:8081`
    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ msg: "Service not found." });
    }


    return res.status(200).json(service);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
