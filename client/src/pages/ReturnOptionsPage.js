// client/src/pages/ReturnOptionsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ReturnOptionsPage() {
  const { itemId } = useParams();
  const [order, setOrder] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [returnOption, setReturnOption] = useState('refund');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get order from localStorage
    const savedOrder = localStorage.getItem('returnOrder');
    const savedSelectedItems = localStorage.getItem('selectedItems');
    
    if (!savedOrder || !savedSelectedItems) {
      navigate('/');
      return;
    }
    
    try {
      const orderData = JSON.parse(savedOrder);
      setOrder(orderData);
      
      // Find the current item
      const item = orderData.line_items.find(item => item.id.toString() === itemId);
      if (!item) throw new Error('Item not found');
      
      setCurrentItem(item);
    } catch (err) {
      setError('Error loading item data');
    }
  }, [itemId, navigate]);

  const handleContinue = () => {
    // Store the return option for this item
    const returnData = JSON.parse(localStorage.getItem('returnData') || '{}');
    if (!returnData[itemId]) {
      // This shouldn't happen if the flow is followed correctly
      navigate(`/return-reason/${itemId}`);
      return;
    }
    
    returnData[itemId] = {
      ...returnData[itemId],
      returnOption
    };
    localStorage.setItem('returnData', JSON.stringify(returnData));
    
    // Check if we need to process more items
    const selectedItems = JSON.parse(localStorage.getItem('selectedItems') || '[]');
    const currentIndex = selectedItems.indexOf(itemId);
    
    if (currentIndex < selectedItems.length - 1) {
      // Move to the next item
      navigate(`/return-reason/${selectedItems[currentIndex + 1]}`);
    } else {
      // All items processed, go to review
      navigate('/return-review');
    }
  };

  if (!currentItem) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Select Return Option</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-6 p-4 border border-gray-200 rounded-md">
        <p className="font-medium">{currentItem.title}</p>
        {currentItem.variant_title && (
          <p className="text-gray-600">{currentItem.variant_title}</p>
        )}
        <p className="text-gray-600 mt-2">Price: ${currentItem.price}</p>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">What would you like to do?</label>
        
        <div className="space-y-4">
          <div className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              id="refund"
              name="returnOption"
              value="refund"
              checked={returnOption === 'refund'}
              onChange={() => setReturnOption('refund')}
              className="mr-3 h-5 w-5"
            />
            <div>
              <label htmlFor="refund" className="font-medium cursor-pointer">
                Refund
              </label>
              <p className="text-gray-600">
                Get your money back to your original payment method.
              </p>
            </div>
          </div>
          
          <div className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              id="exchange"
              name="returnOption"
              value="exchange"
              checked={returnOption === 'exchange'}
              onChange={() => setReturnOption('exchange')}
              className="mr-3 h-5 w-5"
            />
            <div>
              <label htmlFor="exchange" className="font-medium cursor-pointer">
                Exchange
              </label>
              <p className="text-gray-600">
                Exchange this item for another size, color, or similar product.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => navigate(`/return-reason/${itemId}`)}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default ReturnOptionsPage;