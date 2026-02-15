const express = require('express');
const router = express.Router();
const billingCtrl = require('../../controllers/admin/billing.controller');

router.get('/orders/pending', billingCtrl.getPendingOrders);
router.get('/renewals/upcoming', billingCtrl.getUpcomingRenewals);
router.get('/invoices/all', billingCtrl.getGlobalInvoices);
router.get('/services/all', billingCtrl.getAllServices);
module.exports = router;