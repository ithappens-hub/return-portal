// server/models/Store.js
const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  shopDomain: {
    type: String,
    required: true,
    unique: true
  },
  accessToken: {
    type: String,
    required: true
  },
  scopes: String,
  name: String,
  email: String,
  plan: String,
  installed: {
    type: Boolean,
    default: true
  },
  installedAt: {
    type: Date,
    default: Date.now
  },
  uninstalledAt: Date
});

module.exports = mongoose.model('Store', StoreSchema);