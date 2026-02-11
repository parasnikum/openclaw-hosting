import { Router } from "express";
import * as ctrl from "../controllers/services.controller.js";

const router = Router();

// router.post("/", ctrl.createService);
// router.get("/:id", ctrl.getService);
router.post("/:serviceID/build", ctrl.buildService);
router.post("/:serviceID/rebuild", ctrl.rebuildService);
// router.post("/:id/rebuild", ctrl.rebuildService);

// router.post("/:id/upgrade", ctrl.upgradeService);
// router.post("/:id/update", ctrl.upgradeService);
// router.post("/:id/downgrade", ctrl.downgradeService);
// router.post(
//     "/services/:id/limits",
//     asyncHandler(async (req, res) => {
//         const { cpus, memoryMB } = req.body;

//         await updateLimits(req.params.id, {
//             cpus,
//             memoryMB,
//         });

//         res.json({ status: "updated" });
//     })
// );


export default router;
