// server/controllers/products.js
const { getClient } = require('../services/shopify');

exports.getAlternatives = async (req, res) => {
  try {
    const { for: productId } = req.query;
    
    if (!productId) {
      return res.status(400).json({ error: 'Missing productId parameter' });
    }

    // Get original product to find similar products
    const client = getClient();
    const { body: productResponse } = await client.get({
      path: `products/${productId}`,
    });

    // If the product exists, find similar products based on tags or other criteria
    if (productResponse?.product) {
      const product = productResponse.product;
      
      // Use product tags to find similar products
      let query = '';
      if (product.tags) {
        // Find products with similar tags
        query = `status:active AND (${product.tags.split(',').map(tag => `tag:${tag.trim()}`).join(' OR ')})`;
      } else {
        // Fallback to product type
        query = `status:active AND product_type:${product.product_type}`;
      }
      
      const { body: searchResponse } = await client.get({
        path: 'products',
        query: {
          limit: 5,
          fields: 'id,title,variants,images',
          product_type: product.product_type
        }
      });
      
      // Filter out the original product and format the response
      const alternatives = searchResponse.products
        .filter(p => p.id !== product.id)
        .map(p => ({
          id: p.id,
          title: p.title,
          price: p.variants[0]?.price || '0.00',
          image: p.images[0] || null
        }));
      
      return res.json(alternatives);
    }
    
    // If no product found, return empty array
    return res.json([]);
  } catch (error) {
    console.error('Error fetching alternatives:', error);
    res.status(500).json({ error: 'Failed to fetch alternatives from Shopify' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const client = getClient();
    const { body } = await client.get({
      path: `products/${productId}`,
    });
    
    if (!body?.product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    return res.json(body.product);
  } catch (error) {
    console.error('Error fetching product from Shopify:', error);
    res.status(500).json({ error: 'Failed to fetch product from Shopify' });
  }
};