const express = require("express");
const { Pool } = require("pg");
const http = require("http");
const httpProxy = require("http-proxy");

require("dotenv").config();

const app = express();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME ,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: { rejectUnauthorized: false },
});

const domainCache = new Map();
const CACHE_TTL = 10_000;

async function getTargetFromDB(hostname) {
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
    
    const { ip, port } = res.rows[0];
    return `http://${ip}:${port}`;
  } finally {
    client.release();
  }
}

async function resolveTarget(hostname) {
  const cached = domainCache.get(hostname);

  if (cached && cached.expires > Date.now()) {
    return cached.target;
  }

  const target = await getTargetFromDB(hostname);

  if (target) {
    domainCache.set(hostname, {
      target,
      expires: Date.now() + CACHE_TTL,
    });
  }

  return target;
}


const proxy = httpProxy.createProxyServer({
  ws: true,
  changeOrigin: true,
  proxyTimeout: 30000,
  timeout: 30000,
});

proxy.on("error", (err, req, res) => {
  console.error(`[Proxy Error] Target: ${req.url} - Error: ${err.message}`);

  if (res && !res.headersSent) {
    if (typeof res.writeHead === 'function') {
      res.writeHead(502, { "Content-Type": "text/plain" });
      res.end("Bad Gateway: Target unreachable or timed out.");
    }
  }
});

app.use(async (req, res) => {
  try {
    if (!req.headers.host) {
      return res.status(400).send("Missing Host header");
    }

    const hostname = req.headers.host.split(":")[0].split(".")[0];
    
    const target = await resolveTarget(hostname);

    if (!target) {
      return res.status(404).send("Domain not configured");
    }

    proxy.web(req, res, { target, changeOrigin: true, });

  } catch (err) {
    console.error("HTTP routing error:", err);
    res.status(500).send("Internal Server Error");
  }
});

/* =========================
   HTTP Server
========================= */

const server = http.createServer(app);

/* =========================
   WebSocket Upgrade Handling
========================= */

server.on("upgrade", (req, socket, head) => {
  socket.on("error", (err) => {
    if (err.code !== "ECONNRESET") {
      console.error("Socket error:", err.message);
    }
  });

  if (!req.headers.host) {
    socket.destroy();
    return;
  }

  const hostname = req.headers.host.split(":")[0].split(".")[0];

  resolveTarget(hostname)
    .then((target) => {
      if (!target) {
        socket.destroy();
        return;
      }

      proxy.ws(req, socket, head, { target });
    })
    .catch((err) => {
      console.error("WebSocket routing error:", err);
      socket.destroy();
    });
});


/* =========================
   Start Server
========================= */

server.listen(8081, "0.0.0.0", () => {
  console.log("Dynamic proxy running on 0.0.0.0:8081");
});
