// server/routes/products.js
const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');

router.get('/alternatives', productsController.getAlternatives);
router.get('/:productId', productsController.getProductById);

module.exports = router;