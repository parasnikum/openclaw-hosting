import { docker } from "../config/docker.js";
import pool from "../config/db.js";
import { config } from "dotenv";

config({ path: "../.env" });


async function getServerById(serverId) {
  const { rows } = await pool.query(
    `SELECT * FROM servers WHERE service_id = $1`,
    [serverId]
  );
  return rows[0];
}

function getContainer(containerId) {
  if (!containerId) return null;
  return docker.getContainer(containerId);
}

async function doStart(server) {
  const container = getContainer(server.container_id);
  await container.start().catch(() => { });

  await pool.query(
    `UPDATE servers SET status = $1 WHERE id = $2`,
    ["Active", server.id]
  );

  return "Started";
}

async function doStop(server) {
  const container = getContainer(server.container_id);
  await container.stop({ t: 10 }).catch(() => { });

  await pool.query(
    `UPDATE servers SET status = $1 WHERE id = $2`,
    ["Stopped", server.id]
  );

  return "Stopped";
}

async function doRestart(server) {
  const container = getContainer(server.container_id);

  await container.stop({ t: 10 }).catch(() => { });
  await container.start();

  await pool.query(
    `UPDATE servers SET status = $1 WHERE id = $2`,
    ["Active", server.id]
  );

  return "Restarted";
}

/* -------------------------------------------------- */
/* Single Action Controller                            */
/* -------------------------------------------------- */

export async function action(req, res) {
  try {
    const { server_id } = req.params;
    const { action } = req.body;

    if (!server_id) {
      return res.status(400).json({
        status: "error",
        message: "server_id required",
      });
    }

    if (!["start", "stop", "restart"].includes(action)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid action. Use start | stop | restart",
      });
    }

    const server = await getServerById(server_id);

    if (!server || !server.container_id) {
      return res.status(404).json({
        status: "error",
        message: "Server not found",
      });
    }

    let state;

    switch (action) {
      case "start":
        state = await doStart(server);
        break;

      case "stop":
        state = await doStop(server);
        break;

      case "restart":
        state = await doRestart(server);
        break;
    }
    console.log(`Action ${action} Done`)
    return res.status(200).json({
      status: "success",
      state,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}
