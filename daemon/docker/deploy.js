import { docker } from "../config/docker.js";
import fs from "fs";
import path from "path";
import getPort from "get-port";
import pool from "../config/db.js";
import { decryptEnvValue, encryptEnvValue } from "../utils/encryption.js";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { config } from "dotenv";
import { generateConfig } from "../utils/generateConfig.js";

config({ path: "../.env" });

/* -------------------------------------------------- */
/* Constants                                          */
/* -------------------------------------------------- */

const BASE_DIR = "C:/openclaw";
const GATEWAY_PORT = 18789;

const IMAGE_MAP = {
  n8n: "n8n-berry-box",
  openclaw: "openclaw-local",
  nodejs: "nodejs-berry-box",
  python: "python-berry-box",
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
    // Container already removed
  }
}

function ensureDirs(serviceId) {
  const configBaseDir = path.join(BASE_DIR, serviceId, "config");
  const workspaceDir = path.join(BASE_DIR, serviceId, "workspace");

  fs.mkdirSync(configBaseDir, { recursive: true });
  fs.mkdirSync(workspaceDir, { recursive: true });

  return { configBaseDir, workspaceDir };
}

function writeGatewayConfig(configBaseDir, token, hostname, envs, agentsConfig, channels) {
  const providers = {
    openai: {},
    google: {},
    anthropic: {},
    openrouter: {},
    "vercel-ai-gateway": {},
  }
  const configPath = path.join(configBaseDir, "openclaw.json");

  let configData = {
    gateway: {
      mode: "local",
      bind: "lan",
      port: GATEWAY_PORT,
      controlUi: { enabled: true, allowInsecureAuth: true, "allowedOrigins": [`https://${hostname}.berrybox.cloud`] },
      auth: { mode: "token", token },
      trustedProxies: ["192.168.65.0/24", "172.17.0.0/16"],
    },
    agents : agentsConfig,
    ...(channels && { channels })
  };

  console.log("configData", configData);


  fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
}

async function createContainer({
  serviceId,
  category,
  token,
  port,
  configBaseDir,
  workspaceDir,
}) {
  const image = IMAGE_MAP[category];

  if (!image) {
    throw new Error(`Unsupported category: ${category}`);
  }
  const envRes = await pool.query(
    `SELECT name , value FROM envs WHERE service_id = $1`,
    [serviceId]
  );
  if (!envRes.rows.length) {
    throw new Error(`No hostname found for serviceId: ${serviceId}`);
  }

  const map = {
    "OPENAI_API_KEY": "--openai-api-key",
    "OPENROUTER_API_KEY": "--openrouter-api-key",
    "ANTHROPIC_API_KEY": "--anthropic-api-key",
    "VERCEL_AI_GATEWAY_API_KEY": "--ai-gateway-api-key",
    "GOOGLE_API_KEY": "--gemini-api-key",
    "MOONSHOT_API_KEY": "--moonshot-api-key",
    "KIMI_API_KEY": "--kimi-code-api-key",
    "ZAI_API_KEY": "--zai-api-key",
    "MINIMAX_API_KEY": "--minimax-api-key",
    "SYNTHETIC_API_KEY": "--synthetic-api-key",
    "OPENCODE_API_KEY": "--opencode-zen-api-key"
  };
  const envs = envRes.rows
  const envValues = {};
  let cmdEnv = [];
  envs.forEach(row => {
    envValues[row.name] = row.value

    const flag = map[row.name];
    if (flag && row.value) {
      // cmdEnv.push(flag, row.value);
    }
  });

  const envArray = Object.entries(envValues).map(
    ([key, value]) => `${key}=${decryptEnvValue(value)}`
  );
  const container = await docker.createContainer({
    name: `openclaw-${serviceId}-${Date.now()}`,
    Image: image,
    Env: [
      "HOME=/home/node",
      "TERM=xterm-256color",
      `OPENCLAW_GATEWAY_TOKEN=${token}`,
      ...envArray
    ],
    User: "root",
    ExposedPorts: {
      [`${GATEWAY_PORT}/tcp`]: {},
    },
    HostConfig: {
      PortBindings: {
        [`${GATEWAY_PORT}/tcp`]: [{ HostPort: String(port) }],
      },
      Binds: [
        `${configBaseDir}:/home/node/.openclaw`,
        `${workspaceDir}:/home/node/.openclaw/workspace`,
      ],
      RestartPolicy: { Name: "unless-stopped" },
      Init: true,
      // CpuShares: 5,
      // Memory: (1024 * 1024 * 1024),
      // MemorySwap: 0,
    },
    Cmd: [
      "node",
      "dist/index.js",
      "gateway",
      "--bind",
      "lan",
      "--allow-unconfigured",
      "--port",
      String(GATEWAY_PORT),
      // ...cmdEnv
    ],

  });

  await container.start();
  return container;
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
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

    const token = generateToken();
    const port = await getPort();
    const res = await client.query(
      `SELECT hostname FROM project_domains WHERE service_id = $1 LIMIT 1`,
      [serviceId]
    );
    if (!res.rows.length) {
      throw new Error(`No hostname found for serviceId: ${serviceId}`);
    }
    const hostname = res.rows[0].hostname;
    const envRes = await client.query(
      `SELECT name , value FROM envs WHERE service_id = $1`,
      [serviceId]
    );
    if (!envRes.rows.length) {
      throw new Error(`No hostname found for serviceId: ${serviceId}`);
    }
    const envs = envRes.rows

    const providers = envRes.rows
      .filter(row => row.name.endsWith("_API_KEY"))
      .map(row => row.name.replace("_API_KEY", "").toLowerCase());


    const allowedChannels = [
      "SLACK_BOT_TOKEN",
      "SLACK_APP_TOKEN",
      "DISCORD_BOT_TOKEN",
      "TELEGRAM_BOT_TOKEN",
      "WHATSAPP"
    ];
    const channelNames = Array.from(
      new Set(
        envRes.rows
          .filter(row => allowedChannels.some(key => row.name.includes(key)))
          .map(row => row.name.split("_")[0].toLowerCase())
      )
    );

    const config = await generateConfig(providers, channelNames)

    writeGatewayConfig(configBaseDir, token, hostname, envs, config.agentsConfig, config.channels);


    container = await createContainer({
      serviceId,
      category,
      token,
      port,
      configBaseDir,
      workspaceDir,
    });

    await client.query(
      `UPDATE services
       SET container_id = $1, status = 'Active'
       WHERE id = $2`,
      [container.id, serviceId]
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
           status = 'Active'
       WHERE service_id = $6`,
      [
        container.id,
        `http://${process.env.PUBLIC_IP}:${port}`,
        port,
        process.env.PUBLIC_IP,
        category,
        serviceId,
      ]
    );

    await client.query("COMMIT");

    return { containerId: container.id };

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

    const token = generateToken();
    const port = await getPort();


    const res = await client.query(
      `SELECT hostname FROM project_domains WHERE service_id = $1 LIMIT 1`,
      [serviceId]
    );
    if (!res.rows.length) {
      throw new Error(`No hostname found for serviceId: ${serviceId}`);
    }
    const hostname = res.rows[0].hostname;
    const envRes = await client.query(
      `SELECT name , value FROM envs WHERE service_id = $1`,
      [serviceId]
    );
    if (!envRes.rows.length) {
      throw new Error(`No hostname found for serviceId: ${serviceId}`);
    }
    const envs = envRes.rows

    const providers = envRes.rows
      .filter(row => row.name.endsWith("_API_KEY"))
      .map(row => row.name.replace("_API_KEY", "").toLowerCase());

    const allowedChannels = [
      "SLACK_BOT_TOKEN",
      "SLACK_APP_TOKEN",
      "DISCORD_BOT_TOKEN",
      "TELEGRAM_BOT_TOKEN",
      "WHATSAPP"
    ];
    const channelNames = Array.from(
      new Set(
        envRes.rows
          .filter(row => allowedChannels.some(key => row.name.includes(key)))
          .map(row => row.name.split("_")[0].toLowerCase())
      )
    );

    const config = await generateConfig(providers, channelNames)

    writeGatewayConfig(configBaseDir, token, hostname, envs, config.agentsConfig, config.channels);



    newContainer = await createContainer({
      serviceId,
      category,
      token,
      port,
      configBaseDir,
      workspaceDir,
    });

    await client.query(
      `UPDATE services
       SET container_id = $1, status = 'Active'
       WHERE id = $2`,
      [newContainer.id, serviceId]
    );

    // ✅ FIX: Update token in DB (previously missing)
    await client.query(
      `INSERT INTO envs (env_id, name, value, service_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (service_id, name)
       DO UPDATE SET value = EXCLUDED.value`,
      [uuidv4(), "OPENCLAW_GATEWAY_TOKEN", encryptEnvValue(token), serviceId]
    );





    await client.query(
      `UPDATE servers
       SET container_id = $1,
           hostname = $2,
           port = $3,
           ip = $4,
           service_types = $5,
           status = 'Active'
       WHERE service_id = $6`,
      [
        newContainer.id,
        `http://${process.env.PUBLIC_IP}:${port}`,
        port,
        process.env.PUBLIC_IP,
        category,
        serviceId,
      ]
    );
    await client.query("COMMIT");
    if (oldContainerId) {
      await stopAndRemoveContainer(oldContainerId);
    }
    return { containerId: newContainer.id };

  } catch (err) {
    await client.query("ROLLBACK");
    await stopAndRemoveContainer(newContainer?.id);
    throw err;
  } finally {
    client.release();
  }
}

/* -------------------------------------------------- */
/* Reconciliation                                     */
/* -------------------------------------------------- */

export async function reconcileServices() {

  const client = await pool.connect();

  try {
    const { rows } = await client.query(
      `SELECT id, category, status
       FROM services
       WHERE status = 'Provisioning' OR status = 'Failed' 
          OR (status = 'Active' AND container_id IS NULL)`
    );

    if (!rows.length) {
      // console.log("[Cron] No stuck services.");
      return;
    }

    // console.log(`[Cron] Found ${rows.length} services to reconcile.`);

    for (const service of rows) {
      try {
        // console.log(`[Cron] Redeploying ${service.id}`);
        await redeploy(service.id, service.category);
        // console.log(`[Cron] Recovered ${service.id}`);
      } catch (err) {
        console.error(`[Cron] Failed ${service.id}:`, err.message);
      }
    }

  } catch (err) {
    console.error("[Cron] Reconciliation error:", err);
  } finally {
    client.release();
  }
}
