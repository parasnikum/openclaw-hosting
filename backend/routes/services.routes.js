const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/services.controller');

// Import authentication middleware
const { verifyAuth, isAdmin } = require('../middlewares/auth.middleware');

/* =========================================================
   USER ACCESS ROUTES (Requires Login)
   ========================================================= */
router.use(verifyAuth);

/**
 * @route   POST /api/v1/services/create
 * @desc    Purchase & Provision: Creates Service, Server, Invoice, Transaction, and Envs
 */
// router.use(isAdmin);
router.post('/create', ServiceController.createService);

router.get('/my', ServiceController.getUserServices);

router.get('/details/:id', ServiceController.getServiceDetail);


// router.get('/admin/all', ServiceController.getAllServicesAdmin);

// router.patch('/status/:id', ServiceController.updateServiceStatus);

// router.delete('/:id', ServiceController.deleteService);

module.exports = router;