import { Worker } from "bullmq";
import { connection } from "./connections.js";
import * as dockerCtl from "../docker/control.js";
import * as deploy from "../docker/deploy.js";

new Worker(
  "container-commands",
  async job => {
    const { action, serviceId } = job.data;

    switch (action) {
      case "deploy":
        return deploy.deploy(serviceId);

      case "start":
        return dockerCtl.start(serviceId);

      case "stop":
        return dockerCtl.stop(serviceId);

      case "restart":
        return dockerCtl.restart(serviceId);

      case "upgrade":
        return deploy.upgrade(serviceId);

      case "downgrade":
        return deploy.downgrade(serviceId);

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  },
  {
    connection,
    concurrency: 5
  }
);
