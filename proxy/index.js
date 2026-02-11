const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { Pool } = require("pg");
const http = require("http");
const ip = require("ip"); // for subnet checks

require("dotenv").config();

const app = express();

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || "pg-394da032-ncername-4ae2.j.aivencloud.com",
  port: process.env.DB_PORT || 12749,
  user: process.env.DB_USER || "avnadmin",
  password: process.env.DB_PASSWORD || "AVNS_vq39ATh-NM6f-7AzolZ",
  database: process.env.DB_NAME || "openclaw",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: { rejectUnauthorized: false },
});

// Trusted proxies (Docker bridge and localhost)
const TRUSTED_PROXIES = ["172.17.0.0/16", "127.0.0.1"];

// Check if an IP is inside trusted subnets
function isTrustedProxy(clientIp) {
  return TRUSTED_PROXIES.some(subnet => ip.cidrSubnet(subnet).contains(clientIp));
}

// Fetch target backend from database
async function getTarget(hostname) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `
      SELECT s.ip, s.port
      FROM project_domains pd
      JOIN servers s ON pd.service_id = s.service_id
      WHERE pd.hostname = $1
      LIMIT 1
      `,
      [hostname]
    );
    if (res.rows.length === 0) return null;
    const { ip: targetIp, port } = res.rows[0];
    return `http://${targetIp}:${port}`;
  } finally {
    client.release();
  }
}

// Middleware to dynamically proxy HTTP requests
app.use(async (req, res, next) => {
  try {
    const hostHeader = req.headers.host;
    if (!hostHeader) return res.status(400).send("No Host header");

    const hostname = hostHeader.split(":")[0];
    const target = await getTarget(hostname);

    if (!target) return res.status(404).send("Domain not configured");

    const clientIp = (req.socket.remoteAddress || "").replace("::ffff:", "");
    if (!isTrustedProxy(clientIp)) {
      console.warn(`Untrusted proxy connection from ${clientIp}`);
    }

    // Proxy request
    createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true,
      xfwd: true,
      proxyTimeout: 60000,
      timeout: 60000,
    })(req, res, next);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Internal server error");
  }
});

// Create HTTP server and handle WebSockets
const server = http.createServer(app);

server.on("upgrade", async (req, socket, head) => {
  try {
    const hostHeader = req.headers.host;
    if (!hostHeader) return socket.destroy();

    const hostname = hostHeader.split(":")[0];
    const target = await getTarget(hostname);

    if (!target) return socket.destroy();

    // Use same proxy middleware for WS
    createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true,
      xfwd: true,
    }).upgrade(req, socket, head);
  } catch (err) {
    console.error("WebSocket proxy error:", err);
    socket.destroy();
  }
});

// Start server
server.listen(8081, "0.0.0.0", () => {
  console.log("Dynamic proxy running on 0.0.0.0:8081");
});
