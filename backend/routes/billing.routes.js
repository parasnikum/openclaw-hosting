const express = require('express');
const router = express.Router();
const BillingController = require('../controllers/billing.controller');
const { verifyAuth } = require('../middlewares/auth.middleware');

router.use(verifyAuth);

// Renewal Process
router.post('/create-order', BillingController.createRenewalOrder);
router.post('/verify-renewal', BillingController.verifyRenewalPayment);

// History
router.get('/transactions/my', BillingController.getMyTransactions);
router.get('/invoices/my', BillingController.getMyInvoices);

module.exports = router;