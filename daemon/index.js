import express from "express";
import http from "http";
import servicesRoutes from "./routes/services.routes.js";
import containersRoutes from "./routes/containers.routes.js";
// import { initWebSocket } from "./ws/server.js";
import "./queue/worker.js";
// import "./docker/watcher.js";
import dotenv from "dotenv"
dotenv.config();
import {reconcileServices} from "./docker/deploy.js"
setInterval(() => {
  console.log("Running reconcileServices...");
  reconcileServices();
}, 30 * 1000);

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api/services", servicesRoutes);
app.use("/api/containers", containersRoutes);

app.get("/health", (_, res) => res.json({ ok: true }));

// initWebSocket(server);

const PORT = process.env.API_PORT || 7001;
server.listen(PORT, () =>
  console.log(`Agent API listening on ${PORT}`)
);
