import net from "net";
import pool from "../config/db.js";

const RANGE = {
  start: 20000,
  end: 40000
};

export async function allocatePort(nodeId) {
  const { rows } = await db.query(
    `SELECT port FROM servers WHERE on_node=$1 AND port IS NOT NULL`,
    [nodeId]
  );

  const used = new Set(rows.map(r => Number(r.port)));

  for (let port = RANGE.start; port <= RANGE.end; port++) {
    if (used.has(port)) continue;
    if (await isFree(port)) return port;
  }

  throw new Error("No free ports available");
}

function isFree(port) {
  return new Promise(resolve => {
    const s = net
      .createServer()
      .once("error", () => resolve(false))
      .once("listening", () => s.close(() => resolve(true)))
      .listen(port, "0.0.0.0");
  });
}
