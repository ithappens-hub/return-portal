// server/controllers/returns.js
const { getClient } = require('../services/shopify');

// In-memory storage for returns
const inMemoryReturns = [];
let returnIdCounter = 1;

exports.createReturn = async (req, res) => {
  try {
    const { orderId, lineItemId, returnOption, reason } = req.body;
    
    if (!orderId || !lineItemId || !returnOption || !reason) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'orderId, lineItemId, returnOption, and reason are required' 
      });
    }
    
    // Store return data in memory
    const returnRecord = {
      _id: `return_${returnIdCounter++}`,
      orderId,
      lineItemId,
      returnOption,
      reason,
      status: 'pending',
      processedAt: new Date()
    };
    
    inMemoryReturns.push(returnRecord);
    
    // If this is an exchange, additional logic would go here
    // to interact with Shopify API
    
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
    
    const client = getClient();
    const results = [];
    const processedIds = new Set();
    
    for (const item of items) {
      if (processedIds.has(item.lineItemId)) continue;
      processedIds.add(item.lineItemId);
      
      try {
        // Here you would make actual Shopify API calls
        // to process the return or exchange
        // For now, just storing the intent and returning success
        
        // Add to in-memory store
        inMemoryReturns.push({
          _id: `return_batch_${returnIdCounter++}`,
          orderId: item.orderId,
          lineItemId: item.lineItemId,
          returnOption: item.returnOption,
          reason: item.reason,
          status: 'pending',
          processedAt: new Date()
        });
        
        results.push({
          lineItemId: item.lineItemId,
          type: item.returnOption,
          success: true
        });
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
    const returnRecord = inMemoryReturns.find(ret => ret._id === req.params.id);
    
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
    const returns = inMemoryReturns.filter(ret => ret.orderId === req.params.orderId);
    return res.status(200).json(returns);
  } catch (error) {
    console.error('Error fetching returns by order:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch returns',
      details: error.message 
    });
  }
};