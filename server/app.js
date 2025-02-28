const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

app.use('/api/shopify', require('./routes/shopify-app'));

// Create a new middleware for preserving raw body (add to app.js before other middleware)
app.use(express.json({
  verify: (req, res, buf, encoding) => {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  }
}));

// Update CORS config to support Shopify domains
app.use(cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);
      
      // Allow all myshopify.com domains and your app domains
      if (
        origin.endsWith('.myshopify.com') || 
        origin === 'https://admin.shopify.com' ||
        origin === 'http://localhost:3000' || // For local development
        origin === 'https://your-production-url.com' // Update with your production URL
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Add this after your existing middleware setup
const crypto = require('crypto');
const mongoose = require('mongoose');

// Connect to MongoDB (add this to your server/index.js or app.js)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Create a Shopify store model for multi-tenant support
const storeSchema = new mongoose.Schema({
  shopDomain: {
    type: String,
    required: true,
    unique: true
  },
  accessToken: {
    type: String,
    required: true
  },
  scope: String,
  installed: {
    type: Boolean,
    default: true
  },
  installedAt: {
    type: Date,
    default: Date.now
  }
});

const Store = mongoose.model('Store', storeSchema);

// Shopify webhook verification middleware
function verifyShopifyWebhook(req, res, next) {
  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopDomain = req.headers['x-shopify-shop-domain'];
  
  if (!hmacHeader || !shopDomain) {
    return res.status(401).send('Unauthorized');
  }
  
  // You need to access the raw body before it's parsed
  const rawBody = req.rawBody; // Make sure to configure express to preserve rawBody
  
  const calculated_hmac = crypto
    .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
    .update(Buffer.from(rawBody, 'utf8'))
    .digest('base64');
  
  if (calculated_hmac !== hmacHeader) {
    return res.status(401).send('HMAC validation failed');
  }
  
  req.shopDomain = shopDomain;
  next();
}

// Routes
app.use('/api/orders', require('./routes/orders'));
app.use('/api/returns', require('./routes/returns'));
app.use('/api/products', require('./routes/products'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

module.exports = app;