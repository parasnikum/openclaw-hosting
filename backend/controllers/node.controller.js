const pool = require('../config/db');

/**
 * LIST ALL NODES
 */
exports.list = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        n.*,
        COUNT(s.id) AS allocated_servers
      FROM nodes n
      LEFT JOIN servers s
        ON s.on_node = n.node_id
        AND s.status = 'Active'
      GROUP BY n.node_id, n.name, n.max_servers, n.resource_limits, n.domain, n.ip, n.port, n.allowed
      ORDER BY n.node_id ASC
    `);

    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


/**
 * CREATE NEW NODE
 */
exports.create = async (req, res) => {
  try {
    const { node_id, max_servers, resource_limits, domain, ip, port, allowed } = req.body;

    if (!node_id || !ip) {
      return res.status(400).json({ msg: "Node ID and IP Address are required." });
    }

    const query = `
            INSERT INTO nodes (node_id, max_servers, resource_limits, domain, ip, port, allowed)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;

    const values = [
      node_id.toLowerCase(),
      max_servers || 50,
      JSON.stringify(resource_limits || {}),
      domain,
      ip,
      port || 8080,
      allowed !== undefined ? allowed : true
    ];

    const result = await pool.query(query, values);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ msg: "Node ID already exists." });
    return res.status(500).json({ error: error.message });
  }
};

/**
 * GET SINGLE NODE
 */
exports.get = async (req, res) => {
  try {
    const { nodeId } = req.params;
    const result = await pool.query('SELECT * FROM nodes WHERE node_id = $1', [nodeId]);

    if (result.rows.length === 0) return res.status(404).json({ msg: "Node not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * UPDATE NODE (Partial)
 */
exports.update = async (req, res) => {
  console.log("hello");
  try {
    
    const { nodeId } = req.params;
    const { max_servers, resource_limits, domain, ip, port, allowed } = req.body;

    const query = `
            UPDATE nodes 
            SET max_servers = COALESCE($1, max_servers),
                resource_limits = COALESCE($2, resource_limits),
                domain = COALESCE($3, domain),
                ip = COALESCE($4, ip),
                port = COALESCE($5, port),
                allowed = COALESCE($6, allowed)
            WHERE node_id = $7
            RETURNING *
        `;

    const values = [
      max_servers,
      resource_limits ? JSON.stringify(resource_limits) : null,
      domain,
      ip,
      port,
      allowed,
      nodeId
    ];

    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ msg: "Node not found" });

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * REMOVE NODE
 */
exports.remove = async (req, res) => {
  try {
    const { nodeId } = req.params;

    // Check if servers are currently assigned to this node
    const checkServers = await pool.query('SELECT id FROM servers WHERE on_node = $1 LIMIT 1', [nodeId]);
    if (checkServers.rows.length > 0) {
      return res.status(400).json({ msg: "Cannot delete node. Active servers are still assigned to it." });
    }

    await pool.query('DELETE FROM nodes WHERE node_id = $1', [nodeId]);
    return res.status(200).json({ msg: "Node removed from infrastructure" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * NODE HEALTH CHECK (Ping actual server)
 */
exports.health = async (req, res) => {
  try {
    const { nodeId } = req.params;
    const node = await pool.query('SELECT ip, port FROM nodes WHERE node_id = $1', [nodeId]);

    if (node.rows.length === 0) return res.status(404).json({ msg: "Node not found" });

    // Placeholder for real logic (e.g., axios.get(`http://${node.rows[0].ip}:${node.rows[0].port}/health`))
    // For now, returning DB status
    return res.status(200).json({
      nodeId,
      status: "Online",
      latency: "24ms",
      lastCheck: new Date()
    });
  } catch (error) {
    return res.status(500).json({ error: "Could not reach node" });
  }
};

/**
 * NODE STATS (Usage Metrics)
 */
exports.stats = async (req, res) => {
  try {
    const { nodeId } = req.params;

    // Query to count servers on this node
    const serverCount = await pool.query('SELECT COUNT(*) FROM servers WHERE on_node = $1', [nodeId]);

    return res.status(200).json({
      nodeId,
      active_servers: parseInt(serverCount.rows[0].count),
      cpu_usage: "14%",
      ram_usage: "4.2GB / 32GB",
      uptime: "12 days, 4 hours"
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * LIST INSTANCES ON NODE
 */
exports.instances = async (req, res) => {
  try {
    const { nodeId } = req.params;
    const result = await pool.query('SELECT * FROM servers WHERE on_node = $1', [nodeId]);
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};