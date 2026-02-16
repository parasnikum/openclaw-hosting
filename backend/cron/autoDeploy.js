const pool = require('../config/db');
const fetch = require('node-fetch');
const cron = require('node-cron');

// --- 1. Get available node ---
async function getAvailableNode() {
    const client = await pool.connect();
    try {
        const { rows } = await client.query(`
            SELECT 
                n.node_id, 
                n.ip, 
                n.port, 
                n.max_servers, 
                COUNT(s.id) AS allocated_services
            FROM nodes n
            LEFT JOIN servers s
                ON s.on_node = n.node_id
                AND s.status IN ('Active', 'Pending', 'Provisioning')
            WHERE n.allowed = TRUE
            GROUP BY n.node_id, n.ip, n.port, n.max_servers
            HAVING (n.max_servers - COUNT(s.id)) > 0
            ORDER BY (n.max_servers - COUNT(s.id)) DESC
            LIMIT 1
        `);

        if (rows.length === 0) {
            return null; // No node available
        }

        return rows[0];
    } finally {
        client.release();
    }
}

// --- 2. Get all pending/provisioning services ---
async function getPendingServices() {
    const client = await pool.connect();
    try {
        const { rows } = await client.query(`
            SELECT id, service_name 
            FROM services
            WHERE status IN ('Pending', 'Provisioning')
            ORDER BY purchased_on ASC
        `);
        return rows;
    } finally {
        client.release();
    }
}

// --- 3. Process services ---
async function processPendingServices() {
    const services = await getPendingServices();

    for (const service of services) {
        let node = await getAvailableNode();

        if (!node) {
            // console.log("No available nodes, waiting 30 seconds before retrying...");
            await new Promise(res => setTimeout(res, 30000)); // wait 30s
            node = await getAvailableNode();
            if (!node) {
                // console.log(`Skipping service ${service.id}, no nodes available.`);
                continue;
            }
        }

        try {
            const response = await fetch(`http://${node.ip}:${node.port}/api/services/${service.id}/build`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category: "openclaw" }),
                credentials: "include"
            });

            if (response.ok) {
                // console.log(`Service ${service.id} build triggered on node ${node.node_id}`);
            } else {
                console.error(`Failed to trigger service ${service.id} build. Status: ${response.status}`);
            }
        } catch (err) {
            console.error(`Error calling build API for service ${service.id}:`, err.message);
        }
    }
}

function startServiceProvisioningCron() {
    cron.schedule('*/30 * * * * *', async () => {
        // console.log("Cron running: checking pending/provisioning services...");
        await processPendingServices();
    });
}

module.exports = {
    startServiceProvisioningCron
};
