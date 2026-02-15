const express = require('express');
const router = express.Router();
const adminCtrl = require('../../controllers/admin/user.controller');
const { verifyAuth, isAdmin } = require('../../middlewares/auth.middleware');

router.get('/users', verifyAuth, isAdmin, adminCtrl.getAllUsers);
router.get('/users/:id/details', verifyAuth, isAdmin, adminCtrl.getUserDetails);
router.put('/users/:id/status', adminCtrl.suspendToggle);

router.put('/users/:id/reset-password', adminCtrl.resetPassword);
module.exports = router;