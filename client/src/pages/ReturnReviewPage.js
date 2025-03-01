// client/src/pages/ReturnReviewPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitReturn } from '../services/api';

function ReturnReviewPage() {
  const [order, setOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [returnData, setReturnData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get data from localStorage
    const savedOrder = localStorage.getItem('returnOrder');
    const savedSelectedItems = localStorage.getItem('selectedItems');
    const savedReturnData = localStorage.getItem('returnData');
    
    if (!savedOrder || !savedSelectedItems || !savedReturnData) {
      navigate('/');
      return;
    }
    
    try {
      const orderData = JSON.parse(savedOrder);
      const selectedItemIds = JSON.parse(savedSelectedItems);
      const returnDataObj = JSON.parse(savedReturnData);
      
      // Ensure all selected items have return data
      const allItemsHaveData = selectedItemIds.every(id => returnDataObj[id]);
      if (!allItemsHaveData) {
        navigate('/order-details');
        return;
      }
      
      setOrder(orderData);
      setSelectedItems(
        selectedItemIds.map(id => 
          orderData.line_items.find(item => item.id.toString() === id)
        ).filter(Boolean)
      );
      setReturnData(returnDataObj);
    } catch (err) {
      setError('Error loading return data');
    }
  }, [navigate]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Prepare data for API
      const items = selectedItems.map(item => ({
        orderId: order.id,
        lineItemId: item.id,
        returnOption: returnData[item.id].returnOption,
        reason: returnData[item.id].reason,
        additionalInfo: returnData[item.id].additionalInfo || ''
      }));
      
      // Submit all returns in one batch
      await submitReturn({ items });
      
      // Clear stored data
      localStorage.removeItem('selectedItems');
      localStorage.removeItem('returnData');
      
      // Go to success page
      navigate('/success');
    } catch (err) {
      setError(err.message || 'Failed to submit return request');
      setLoading(false);
    }
  };

  if (!order || selectedItems.length === 0) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Review Your Return</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <p className="text-gray-600">Order #{order.order_number}</p>
        <p className="text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
      </div>
      
      <div className="mt-6 mb-8">
        <h2 className="text-lg font-medium mb-3">Items to Return</h2>
        
        <div className="border rounded-md overflow-hidden">
          {selectedItems.map((item) => (
            <div key={item.id} className="p-4 border-b last:border-b-0">
              <div className="flex justify-between mb-2">
                <p className="font-medium">{item.title}</p>
                <p className="font-medium">${item.price}</p>
              </div>
              
              {item.variant_title && (
                <p className="text-gray-600 mb-2">{item.variant_title}</p>
              )}
              
              <div className="mt-3 text-gray-700">
                <p><span className="font-medium">Return Option:</span> {returnData[item.id].returnOption === 'refund' ? 'Refund' : 'Exchange'}</p>
                <p><span className="font-medium">Reason:</span> {returnData[item.id].reason}</p>
                {returnData[item.id].additionalInfo && (
                  <p><span className="font-medium">Additional Info:</span> {returnData[item.id].additionalInfo}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 border-t pt-6">
        <h2 className="text-lg font-medium mb-4">Return Instructions</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Pack your items securely in their original packaging if possible.</li>
          <li>Include a copy of your order confirmation or reference number.</li>
          <li>Ship your return to our returns center at the address below.</li>
          <li>After we receive your return, we'll process it within 3-5 business days.</li>
        </ol>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="font-medium">Return Address:</p>
          <p>Your Company Returns</p>
          <p>123 Main Street</p>
          <p>Suite 100</p>
          <p>City, State 12345</p>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={() => navigate('/order-details')}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={loading}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit Return Request'}
        </button>
      </div>
    </div>
  );
}

export default ReturnReviewPage;