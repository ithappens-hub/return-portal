// client/src/pages/ReturnReasonPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RETURN_REASONS = [
  'Wrong size',
  'Wrong color',
  'Damaged/defective',
  'Not as described',
  'Changed my mind',
  'Other'
];

function ReturnReasonPage() {
  const { itemId } = useParams();
  const [order, setOrder] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get order and selected items from localStorage
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedReason) {
      setError('Please select a reason for your return');
      return;
    }
    
    // Store the reason for this item
    const returnData = JSON.parse(localStorage.getItem('returnData') || '{}');
    returnData[itemId] = {
      reason: selectedReason,
      additionalInfo
    };
    localStorage.setItem('returnData', JSON.stringify(returnData));
    
    // Navigate to return options for this item
    navigate(`/return-options/${itemId}`);
  };

  if (!currentItem) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Why are you returning this item?</h1>
      
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
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2 font-medium">Select a reason:</label>
          <div className="space-y-2">
            {RETURN_REASONS.map(reason => (
              <div key={reason} className="flex items-center">
                <input
                  type="radio"
                  id={`reason-${reason}`}
                  name="returnReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="mr-2"
                />
                <label htmlFor={`reason-${reason}`}>{reason}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="additionalInfo" className="block mb-2 font-medium">
            Additional Information (optional):
          </label>
          <textarea
            id="additionalInfo"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="w-full p-2 border rounded-md h-32"
            placeholder="Please provide any additional details about your return..."
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/order-details')}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReturnReasonPage;