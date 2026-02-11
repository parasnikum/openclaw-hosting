const router = require("express").Router();
const InstanceController = require("../controllers/instance.controller");

router.get("/", InstanceController.list);
router.post("/", InstanceController.create);

router.get("/:instanceId", InstanceController.get);
router.patch("/:instanceId", InstanceController.update);
router.delete("/:instanceId", InstanceController.remove);

// runtime
router.post("/:instanceId/start", InstanceController.start);
router.post("/:instanceId/stop", InstanceController.stop);
router.post("/:instanceId/restart", InstanceController.restart);
router.post("/:instanceId/rebuild", InstanceController.rebuild);

// config
router.get("/:instanceId/config", InstanceController.getConfig);
router.patch("/:instanceId/config", InstanceController.updateConfig);

// env
router.get("/:instanceId/env", InstanceController.listEnv);
router.post("/:instanceId/env", InstanceController.addEnv);
router.patch("/:instanceId/env/:envId", InstanceController.updateEnv);
router.delete("/:instanceId/env/:envId", InstanceController.removeEnv);

// logs
router.get("/:instanceId/logs", InstanceController.logs);
router.get("/:instanceId/metrics", InstanceController.metrics);
router.get("/:instanceId/events", InstanceController.events);

// backup
router.get("/:instanceId/backups", InstanceController.backups);
router.post("/:instanceId/backups", InstanceController.createBackup);
router.post("/:instanceId/restore", InstanceController.restore);

module.exports = router;
