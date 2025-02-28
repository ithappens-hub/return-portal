// server/controllers/returns.js
const Return = require('../models/Return');
const { getClient } = require('../services/shopify');

exports.createReturn = async (req, res) => {
  try {
    const { orderId, lineItemId, returnOption, reason } = req.body;
    
    if (!orderId || !lineItemId || !returnOption || !reason) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'orderId, lineItemId, returnOption, and reason are required' 
      });
    }
    
    // Create return record in database
    const returnRecord = new Return({
      orderId,
      lineItemId,
      returnOption,
      reason,
      status: 'pending'
    });
    
    await returnRecord.save();
    
    // If this is an exchange, additional logic would go here
    if (returnOption === 'exchange') {
      // Process exchange with Shopify
      // This would handle variant selection, etc.
    }
    
    return res.status(201).json({
      success: true,
      returnId: returnRecord._id,
      message: 'Return created successfully'
    });
  } catch (error) {
    console.error('Error creating return:', error);
    return res.status(500).json({ 
      error: 'Failed to create return',
      details: error.message
    });
  }
};

exports.batchProcess = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        details: 'Expected an array of items'
      });
    }
    
    const results = [];
    const processedIds = new Set();
    
    for (const item of items) {
      // Skip duplicates
      if (processedIds.has(item.lineItemId)) continue;
      processedIds.add(item.lineItemId);
      
      try {
        // Process based on return option
        if (item.returnOption === 'exchange') {
          // Handle exchange logic
          // This would interact with Shopify API to process exchanges
          results.push({
            lineItemId: item.lineItemId,
            type: 'exchange',
            success: true
          });
        } else {
          // Handle standard return
          // This would interact with Shopify API to process returns
          results.push({
            lineItemId: item.lineItemId,
            type: 'return',
            success: true
          });
        }
      } catch (itemError) {
        console.error(`Error processing item ${item.lineItemId}:`, itemError);
        results.push({
          lineItemId: item.lineItemId,
          type: item.returnOption,
          success: false,
          error: itemError.message
        });
      }
    }
    
    // Check if any operations failed
    const hasFailures = results.some(result => !result.success);
    
    if (hasFailures) {
      return res.status(207).json({
        partialSuccess: true,
        results
      });
    }
    
    return res.status(200).json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Error processing batch:', error);
    return res.status(500).json({
      error: 'Error processing batch',
      details: error.message
    });
  }
};

exports.getReturnById = async (req, res) => {
  try {
    const returnRecord = await Return.findById(req.params.id);
    
    if (!returnRecord) {
      return res.status(404).json({ error: 'Return not found' });
    }
    
    return res.status(200).json(returnRecord);
  } catch (error) {
    console.error('Error fetching return:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch return',
      details: error.message 
    });
  }
};

exports.getReturnsByOrder = async (req, res) => {
  try {
    const returns = await Return.find({ orderId: req.params.orderId });
    return res.status(200).json(returns);
  } catch (error) {
    console.error('Error fetching returns by order:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch returns',
      details: error.message 
    });
  }
};

// server/routes/products.js
const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');

router.get('/alternatives', productsController.getAlternatives);
router.get('/:productId', productsController.getProductById);

module.exports = router;
