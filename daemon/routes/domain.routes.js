import { Router } from "express";
import * as ctrl from "../controllers/services.controller.js";

const router = Router();

router.get("/:id/domaininfo", ctrl.getDomain);
router.post("/:id/domaininfo", ctrl.createDomain);
router.patch("/:id/domaininfo", ctrl.updateDomain);

export default router;
