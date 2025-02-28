const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');

router.post('/lookup', ordersController.lookupOrder);

module.exports = router;