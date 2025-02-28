// server/models/ReturnConfig.js
const mongoose = require('mongoose');

const ReturnConfigSchema = new mongoose.Schema({
  shopDomain: {
    type: String,
    required: true,
    unique: true
  },
  returnWindow: {
    type: Number,
    default: 30, // Default 30-day return window
    min: 1,
    max: 365
  },
  allowExchanges: {
    type: Boolean,
    default: true
  },
  refundMethod: {
    type: String,
    enum: ['original', 'store_credit', 'both'],
    default: 'original'
  },
  autoApprove: {
    type: Boolean,
    default: false
  },
  returnReasons: [{
    id: String,
    label: String,
    active: {
      type: Boolean,
      default: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updatedAt field
ReturnConfigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ReturnConfig', ReturnConfigSchema);