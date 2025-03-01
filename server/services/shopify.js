// server/services/shopify.js
const { shopifyApi } = require('@shopify/shopify-api');
const { restResources } = require('@shopify/shopify-api/rest/admin/2024-01');
// Add this line to import the Node runtime adapter
const { NodeHttpAdapter } = require('@shopify/shopify-api/adapters/node-http');
require('dotenv').config();

// Initialize Shopify API with the adapter
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ['read_orders', 'write_orders', 'read_products'],
  hostName: process.env.SHOPIFY_SHOP_DOMAIN,
  apiVersion: '2024-01',
  isPrivateApp: true,
  // Add this line to specify the adapter
  customAdapterOptions: { adapter: new NodeHttpAdapter() }
});

// Create a Session
const createSession = () => {
  const session = {
    shop: process.env.SHOPIFY_SHOP_DOMAIN,
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    isOnline: false
  };
  
  return session;
};

// Create REST client
const getClient = () => {
  try {
    const session = createSession();
    return new shopify.clients.Rest({ session });
  } catch (err) {
    console.error('Error creating Shopify REST client:', err);
    throw err;
  }
};

module.exports = {
  shopify,
  getClient,
};