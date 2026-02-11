import { commandQueue } from "../queue/commands.queue.js";

export async function startContainer(req, res) {
  await commandQueue.add("container", {
    action: "start",
    serviceId: req.params.id
  });

  res.json({ queued: true });
}

export async function stopContainer(req, res) {
  await commandQueue.add("container", {
    action: "stop",
    serviceId: req.params.id
  });

  res.json({ queued: true });
}

export async function restartContainer(req, res) {
  await commandQueue.add(
    "container",
    {
      action: "restart",
      serviceId: req.params.id
    },
    {
      attempts: 5,
      backoff: { type: "exponential", delay: 2000 }
    }
  );

  res.json({ queued: true });
}
