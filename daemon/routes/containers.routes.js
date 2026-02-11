import { Router } from "express";
import * as ctrl from "../controllers/containers.controller.js";

const router = Router();

router.post("/:id/start", ctrl.startContainer);
router.post("/:id/stop", ctrl.stopContainer);
router.post("/:id/restart", ctrl.restartContainer);


router.get("/:id/env", ctrl.restartContainer);
router.post("/:id/env", ctrl.restartContainer);
router.patch("/:id/env", ctrl.restartContainer);
router.delete("/:id/env", ctrl.restartContainer);

export default router;
