import WebSocket from "ws";
import { metricsCache } from "../docker/metrics.js";

export function initWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", ws => {
    const interval = setInterval(() => {
      ws.send(
        JSON.stringify({
          type: "metrics",
          data: [...metricsCache.values()]
        })
      );
    }, 1000);

    ws.on("close", () => clearInterval(interval));
  });
}
