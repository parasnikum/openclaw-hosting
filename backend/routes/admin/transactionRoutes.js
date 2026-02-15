const express = require('express');
const router = express.Router();
const txCtrl = require('../../controllers/admin/transaction.controller');
// const { isAdmin } = require('../middleware/auth'); // Highly recommended

router.get('/all', txCtrl.getAllTransactions);
router.get('/:id', txCtrl.getTransactionById);

module.exports = router;