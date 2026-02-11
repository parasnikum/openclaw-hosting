import { docker } from "../config/docker.js";
import pool from "../config/db.js";

/**
 * Resolve container safely from DB
 */
async function resolveContainer(serviceId) {
    const { rows } = await db.query(
        `
    SELECT container_id
    FROM services
    WHERE id = $1
    `,
        [serviceId]
    );

    if (!rows.length || !rows[0].container_id) {
        throw new Error(`Container not found for service ${serviceId}`);
    }

    return docker.getContainer(rows[0].container_id);
}

/**
 * Start container
 */
export async function start(serviceId) {
    const container = await resolveContainer(serviceId);

    try {
        await container.start();
    } catch (err) {
        // Already running is NOT a failure
        if (err.statusCode !== 304) {
            throw err;
        }
    }
}

/**
 * Stop container (graceful)
 */
export async function stop(serviceId) {
    const container = await resolveContainer(serviceId);

    try {
        await container.stop({ t: 10 }); // 10s grace
    } catch (err) {
        // Already stopped is NOT a failure
        if (err.statusCode !== 304) {
            throw err;
        }
    }
}

/**
 * Restart container
 */
export async function restart(serviceId) {
    const container = await resolveContainer(serviceId);

    await container.restart({ t: 10 });
}


export async function updateLimits(serviceId, options) {
  const container = await resolveContainer(serviceId);

  const updateConfig = {};

  // CPU: 1 CPU = 1_000_000_000 NanoCpus
  if (options.cpus) {
    updateConfig.NanoCpus = Math.floor(options.cpus * 1e9);
  }

  // Memory in MB → bytes
  if (options.memoryMB) {
    updateConfig.Memory = options.memoryMB * 1024 * 1024;
  }

  if (!Object.keys(updateConfig).length) {
    throw new Error("No valid resource updates provided");
  }

  await container.update(updateConfig);

  // Optional: store plan snapshot (NOT metrics)
  await db.query(
    `
    UPDATE services
    SET cpu_limit = COALESCE($1, cpu_limit),
        memory_limit = COALESCE($2, memory_limit),
        updated_at = NOW()
    WHERE id = $3
    `,
    [
      options.cpus ?? null,
      options.memoryMB ?? null,
      serviceId
    ]
  );
}
