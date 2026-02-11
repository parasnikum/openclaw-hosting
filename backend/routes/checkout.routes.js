const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout.controller');
const { verifyAuth } = require('../middlewares/auth.middleware');

router.use(verifyAuth);

// Renewal Process
router.post('/create-order', checkoutController.createOrder);


module.exports = router;