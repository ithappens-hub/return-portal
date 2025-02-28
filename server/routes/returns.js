// server/routes/returns.js
const express = require('express');
const router = express.Router();
const returnsController = require('../controllers/returns');

router.post('/create', returnsController.createReturn);
router.post('/batch-process', returnsController.batchProcess);
router.get('/:id', returnsController.getReturnById);
router.get('/by-order/:orderId', returnsController.getReturnsByOrder);

module.exports = router;