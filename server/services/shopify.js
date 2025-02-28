const { shopifyApi, Session } = require('@shopify/shopify-api');
const { restResources } = require('@shopify/shopify-api/rest/admin/2024-01');

// Initialize Shopify API
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ['read_orders', 'write_orders'],
  hostName: process.env.SHOPIFY_SHOP_DOMAIN,
  apiVersion: '2024-01',
  isPrivateApp: true,
  restResources,
});

// Create a Session
const createSession = () => {
  const session = new Session({
    id: 'unique-session-id',
    shop: process.env.SHOPIFY_SHOP_DOMAIN,
    state: 'state',
    isOnline: false,
  });
  
  session.accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
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