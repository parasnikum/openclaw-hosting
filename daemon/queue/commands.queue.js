import { Queue } from "bullmq";
import { connection } from "./connections.js";

export const commandQueue = new Queue("container-commands", {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false
  }
});
