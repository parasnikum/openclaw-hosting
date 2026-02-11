const express = require('express');
const router = express.Router();
const planController = require('../../controllers/admin/plan.controller');

// Import your custom middlewares
const {verifyAuth,isAdmin} = require('../../middlewares/auth.middleware');

/* =========================================================
   PUBLIC ROUTES
   ========================================================= */

// Allows users to see available plans on the landing page/pricing page
router.get('/public/all', planController.getAllPlansAdmin); 

/* =========================================================
   ADMIN ROUTES (Protected)
   ========================================================= */

// Apply protection to all routes below this line
router.use(verifyAuth);
router.use(isAdmin);

// Create a new plan tier
router.post('/create', planController.createPlan);

// Update existing plan (Price, Config, Features)
router.put('/update/:id', planController.updatePlan);

// Delete a plan (Fails if services are linked)
router.delete('/delete/:id', planController.deletePlan);

// Get all plans including inactive ones for the admin dashboard
router.get('/admin/all', planController.getAllPlansAdmin);

module.exports = router;