
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
      `INSERT INTO services
       (id, service_name, plan_id, user_id, purchased_on, renewal_date, status, category)
       VALUES ($1, $2, $3, $4, NOW(), NOW() + INTERVAL '30 days', 'Provisioning', 'openclaw')`,
      [serviceId, service_name, plan_id, user_id]
    );

    // 4. Create Server (linked to service)
    const serverId = uuidv4();
    await client.query(
      `INSERT INTO servers
       (id, server_name, service_id, on_node, ip, port, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'Provisioning')`,
      [serverId, service_name, serviceId, targetNode, '127.0.0.1', '3000']
    );

    // 5. Save environment & overrides ONLY
    for (const [name, value] of Object.entries(config.env)) {
      const encryptedValue = encryptEnvValue(value);

      await client.query(
        `INSERT INTO envs (env_id, service_id, name, value)
            VALUES ($1, $2, $3, $4)`,
        [uuidv4(), serviceId, name, encryptedValue]
      );
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
    // 7. Transaction
    await client.query(
      `INSERT INTO project_domains
       (id, service_id, domain_type, hostname, ssl_enabled, ssl_status)
       VALUES ($1, $2, $3, $4, $5,$6)`,
      [uuidv4(), serviceId, "subdomain", subdomain, true, `Provisining`]
    );


    await client.query("COMMIT");

    const node = await getAvailableNode();

    // 2. Use its IP and port when creating the service
    const response = await fetch(`http://${node.ip}:${node.port}/api/services/${serviceId}/build`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "openclaw" }),
      credentials: "include"
    });

    if (!response.ok) {
      const err = await response.text();
      console.log(err);

      throw new Error(`Failed to build service: ${err}`);
    }

    return res.status(201).json({
      status: "Success",
      msg: `Provisioned on node ${node.node_id}. Next renewal in 30 days.`,
      serviceId,
      node: { ip: node.ip, port: node.port }
    });


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
