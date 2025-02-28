/**
 * This would be the code for your server/routes/shopify-app.js file
 * Copy this into a new file
 */

// Create a new route file: server/routes/shopify-app.js
/**
 * This would be the code for your server/routes/shopify-app.js file
 * Copy this into a new file
 */

const express = require('express');
const router = express.Router();
const { shopify } = require('../services/shopify');
const Store = require('../models/Store'); // Import your Store model

// Auth callback handler
router.get('/auth/callback', async (req, res) => {
  try {
    const { shop, code, state } = req.query;
    
    if (!shop || !code) {
      return res.status(400).send('Missing required parameters');
    }
    
    // Validate the auth callback
    const session = await shopify.auth.validateAuthCallback(
      req, 
      res, 
      { shop, code, state }
    );
    
    // Save store info to database
    await Store.findOneAndUpdate(
      { shopDomain: shop },
      { 
        accessToken: session.accessToken,
        scope: session.scope,
        installed: true,
        installedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    // Register webhooks
    await registerWebhooks(shop, session.accessToken);
    
    // Redirect to app
    res.redirect(`/?shop=${shop}`);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).send('An error occurred during authentication');
  }
});

// Auth start
router.get('/auth', async (req, res) => {
  try {
    const { shop } = req.query;
    
    if (!shop) {
      return res.status(400).send('Missing shop parameter');
    }
    
    // Start the OAuth process
    const authUrl = await shopify.auth.beginAuth(
      req,
      res,
      shop,
      '/api/shopify/auth/callback',
      false
    );
    
    res.redirect(authUrl);
  } catch (error) {
    console.error('Auth start error:', error);
    res.status(500).send('An error occurred starting authentication');
  }
});

// Webhook handler for order creation
router.post('/webhooks/orders/create', verifyShopifyWebhook, async (req, res) => {
  try {
    console.log(`Received order creation webhook from ${req.shopDomain}`);
    // Process the webhook
    // This is where you'd handle any order processing logic
    
    res.status(200).send();
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send();
  }
});

// Register webhooks
async function registerWebhooks(shop, accessToken) {
  try {
    const session = {
      shop,
      accessToken
    };
    
    // Register order creation webhook
    await shopify.webhooks.register({
      session,
      path: '/api/shopify/webhooks/orders/create',
      topic: 'ORDERS_CREATE',
      webhookHandler: (topic, shop, body) => {
        console.log(`Received ${topic} webhook from ${shop}`);
      }
    });
    
    console.log('Webhooks registered successfully');
  } catch (error) {
    console.error('Error registering webhooks:', error);
    throw error;
  }
}

module.exports = router;