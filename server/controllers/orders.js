const { getClient } = require('../services/shopify');

const RETURN_WINDOW_DAYS = 100;

exports.lookupOrder = async (req, res) => {
  const { orderId, email } = req.body;

  if (!orderId || !email) {
    return res.status(400).json({ error: 'Missing orderId or email' });
  }

  try {
    const client = getClient();
    const { body } = await client.get({
      path: `orders/${orderId}`,
    });

    if (!body?.order || body.order.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(404).json({ error: 'Order not found or email mismatch' });
    }

    // Process the order data (similar to your existing implementation)
    const refunds = body.order.refunds.flatMap((refund) =>
      refund.refund_line_items.map((item) => item.line_item_id)
    );

    // Calculate the cutoff date for returns
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETURN_WINDOW_DAYS);

    // Filter eligible items
    const eligibleItems = body.order.line_items.filter((item) => {
      // Your existing eligibility logic
      const isEligible = item.fulfillment_status === 'fulfilled' && 
                        !refunds.includes(item.id);
      
      if (!isEligible) return false;

      // Additional logic...
      return true;
    });

    return res.status(200).json({
      ...body.order,
      line_items: eligibleItems,
    });
  } catch (err) {
    console.error('Error fetching Shopify order:', err);
    return res.status(404).json({ error: 'Order not found' });
  }
};