const express = require('express');
const router = express.Router();
const serverController = require('../controllers/server.controller');

// Import authentication middleware
const { verifyAuth } = require('../middlewares/auth.middleware');
router.use(verifyAuth);

router.post('/:server_id/action', serverController.action);


module.exports = router;