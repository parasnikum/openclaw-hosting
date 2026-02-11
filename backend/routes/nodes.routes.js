const router = require("express").Router();
const NodeController = require("../controllers/node.controller.js");

router.get("/", NodeController.list);
router.post("/create", NodeController.create);
router.get("/:nodeId", NodeController.get);
router.patch("/:nodeId", NodeController.update);
router.delete("/:nodeId", NodeController.remove);

router.get("/:nodeId/health", NodeController.health);
router.get("/:nodeId/stats", NodeController.stats);
router.get("/:nodeId/instances", NodeController.instances);

module.exports = router;
