import { docker } from "../config/docker.js";
import fs from "fs";
import path from "path";
import getPort from "get-port";
import pool from "../config/db.js";
import { encryptEnvValue } from "../utils/encryption.js";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { config } from "dotenv";

config({ path: "../.env" });

const imageName = {
  n8n: "n8n-berry-box",
  openclaw: "openclaw-local",
  nodejs: "nodejs-berry-box",
  python: "n8n-berry-box",
};

/* -------------------------------------------------- */
/* Helpers                                            */
/* -------------------------------------------------- */

async function stopAndRemoveContainer(containerId) {
  if (!containerId) return;

  try {
    const container = docker.getContainer(containerId);
    await container.stop({ t: 10 }).catch(() => { });
    await container.remove({ force: true }).catch(() => { });
  } catch {
    // container already gone
  }
}

function ensureDirs(serviceId) {
  const configBaseDir = `C:/openclaw/${serviceId}/config`;
  const workspaceDir = `C:/openclaw/${serviceId}/workspace`;

  fs.mkdirSync(configBaseDir, { recursive: true });
  fs.mkdirSync(workspaceDir, { recursive: true });

  return { configBaseDir, workspaceDir };
}

function writeGatewayConfig(configBaseDir, token) {
  const gatewayConfigPath = path.join(configBaseDir, "openclaw.json");

  const gatewayConfig = {
    gateway: {
      mode: "local",
      bind: "lan",
      port: 18789,
      controlUi: { enabled: true, allowInsecureAuth: true },
      auth: { mode: "token", token },
      trustedProxies: ["192.168.65.0/24", "172.17.0.0/16"],
    },
  };

  fs.writeFileSync(
    gatewayConfigPath,
    JSON.stringify(gatewayConfig, null, 2),
    "utf8"
  );
}

async function createGatewayContainer({
  serviceId,
  category,
  token,
  port,
  configBaseDir,
  workspaceDir,
}) {
  const date = Date.now();

  const container = await docker.createContainer({
    name: `openclaw-gateway-${serviceId}-${date}`,
    Image: imageName[category],
    Env: [
      "HOME=/home/node",
      "TERM=xterm-256color",
      `OPENCLAW_GATEWAY_TOKEN=${token}`,
    ],
    ExposedPorts: {
      "18789/tcp": {},
    },
    HostConfig: {
      PortBindings: {
        "18789/tcp": [{ HostPort: String(port) }],
      },
      Binds: [
        `${configBaseDir}:/home/node/.openclaw`,
        `${workspaceDir}:/home/node/.openclaw/workspace`,
      ],
      RestartPolicy: { Name: "unless-stopped" },
      Init: true,
    },
    Cmd: [
      "node",
      "dist/index.js",
      "gateway",
      "--bind",
      "lan",
      "--port",
      "18789",
    ],
  });

  await container.start();
  return container;
}

async function createOpenClawContainer({
  serviceId,
  category,
  port,
  configBaseDir,
  workspaceDir,
}) {
  const date = Date.now();

  const container = await docker.createContainer({
    name: `openclaw-gateway-${serviceId}-${date}`,
    Image: imageName[category],
    Env: [
      "HOME=/home/node",
      "TERM=xterm-256color",
      `OPENCLAW_GATEWAY_TOKEN=${token}`,
    ],
    ExposedPorts: {
      "18789/tcp": {},
    },
    HostConfig: {
      PortBindings: {
        "18789/tcp": [{ HostPort: String(port) }],
      },
      Binds: [
        `${configBaseDir}:/home/node/.openclaw`,
        `${workspaceDir}:/home/node/.openclaw/workspace`,
      ],
      RestartPolicy: { Name: "unless-stopped" },
      Init: true,
    },
    Cmd: [
      "node",
      "dist/index.js",
      "gateway",
      "--bind",
      "lan",
      "--port",
      "18789",
    ],
  });

  await container.start();
  return container;
}


/* -------------------------------------------------- */
/* Deploy                                             */
/* -------------------------------------------------- */

export async function deploy(serviceId, category) {
  const { configBaseDir, workspaceDir } = ensureDirs(serviceId);
  const client = await pool.connect();
  let container;

  try {
    await client.query("BEGIN");

    const token = crypto.randomBytes(32).toString("hex");
    const port = await getPort();

    writeGatewayConfig(configBaseDir, token);

    container = await createGatewayContainer({
      serviceId,
      category,
      token,
      port,
      configBaseDir,
      workspaceDir,
    });

    await client.query(
      `UPDATE services
       SET container_id = $1, status = $2
       WHERE id = $3`,
      [container.id, "Active", serviceId]
    );

    await client.query(
      `INSERT INTO envs (env_id, name, value, service_id)
       VALUES ($1, $2, $3, $4)`,
      [
        uuidv4(),
        "OPENCLAW_GATEWAY_TOKEN",
        encryptEnvValue(token),
        serviceId,
      ]
    );

    await client.query(
      `UPDATE servers
       SET container_id = $1,
           hostname = $2,
           port = $3,
           ip = $4,
           service_types = $5,
           status = $6
       WHERE service_id = $7`,
      [
        container.id,
        `http://${process.env.PUBLIC_IP}:${port}`,
        port,
        process.env.PUBLIC_IP,
        category,
        "Active",
        serviceId,
      ]
    );

    await client.query("COMMIT");

    return { gatewayContainerId: container.id };
  } catch (err) {
    await client.query("ROLLBACK");
    await stopAndRemoveContainer(container?.id);
    throw err;
  } finally {
    client.release();
  }
}

/* -------------------------------------------------- */
/* Redeploy                                           */
/* -------------------------------------------------- */

export async function redeploy(serviceId, category) {
  const { configBaseDir, workspaceDir } = ensureDirs(serviceId);
  const client = await pool.connect();
  let newContainer;

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT container_id FROM services WHERE id = $1`,
      [serviceId]
    );

    const oldContainerId = rows[0]?.container_id;

    const port = await getPort();

    // Stop old container first
    if (oldContainerId) {
      await stopAndRemoveContainer(oldContainerId);
    }

    // 🔥 Deploy OPENCLAW (not gateway)
    newContainer = await createOpenClawContainer({
      serviceId,
      category,
      port,
      configBaseDir,
      workspaceDir,
    });

    await client.query(
      `UPDATE services
       SET container_id = $1, status = $2
       WHERE id = $3`,
      [newContainer.id, "Active", serviceId]
    );

    await client.query(
      `UPDATE servers
       SET container_id = $1,
           hostname = $2,
           port = $3,
           ip = $4,
           service_types = $5,
           status = $6
       WHERE service_id = $7`,
      [
        newContainer.id,
        `http://${process.env.PUBLIC_IP}:${port}`,
        port,
        process.env.PUBLIC_IP,
        category,
        "Active",
        serviceId,
      ]
    );

    await client.query("COMMIT");

    return { openclawContainerId: newContainer.id };

  } catch (err) {
    await client.query("ROLLBACK");

    if (newContainer?.id) {
      await stopAndRemoveContainer(newContainer.id);
    }

    throw err;
  } finally {
    client.release();
  }
}



export async function reconcileServices() {
  console.log(`[Cron] Starting service reconciliation check: ${new Date().toISOString()}`);

  const client = await pool.connect();

  try {
    // 1. Find services stuck in 'Provisioning' or 'Active' with no container_id
    // You can adjust the 'interval' to define how long is "too long" (e.g., 5 minutes)
    const { rows: stuckServices } = await client.query(
      `SELECT id, category, status 
             FROM services 
             WHERE (status = 'Provisioning') 
                OR (status = 'Active' AND container_id IS NULL)`
    );

    if (stuckServices.length === 0) {
      console.log("[Cron] All services are healthy.");
      return;
    }

    console.log(`[Cron] Found ${stuckServices.length} services requiring attention.`);

    for (const service of stuckServices) {
      try {
        console.log(`[Cron] Redeploying stuck service: ${service.id} (Current Status: ${service.status})`);

        // Trigger the existing redeploy logic
        await redeploy(service.id, service.category);

        console.log(`[Cron] Successfully recovered service: ${service.id}`);
      } catch (error) {

        console.log(error);

        console.error(`[Cron] Failed to recover service ${service.id}:`, error.message);
      }
    }

  } catch (err) {
    console.error("[Cron] Error during reconciliation loop:", err);
  } finally {
    client.release();
  }
}