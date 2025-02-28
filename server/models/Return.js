// server/models/Return.js
const mongoose = require('mongoose');

const ReturnSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  lineItemId: {
    type: String,
    required: true,
  },
  returnOption: {
    type: String,
    enum: ['return', 'exchange'],
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  processedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'cancelled'],
    default: 'pending',
  },
  // Add additional fields as needed
});

module.exports = mongoose.model('Return', ReturnSchema);