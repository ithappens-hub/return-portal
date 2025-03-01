// client/src/pages/OrderDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OrderDetailsPage() {
  const [order, setOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get order from localStorage (set during the lookup)
    const savedOrder = localStorage.getItem('returnOrder');
    if (!savedOrder) {
      navigate('/');
      return;
    }
    
    try {
      setOrder(JSON.parse(savedOrder));
    } catch (err) {
      setError('Invalid order data');
      navigate('/');
    }
  }, [navigate]);

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleContinue = () => {
    const selectedItemIds = Object.keys(selectedItems).filter(id => selectedItems[id]);
    
    if (selectedItemIds.length === 0) {
      setError('Please select at least one item to return');
      return;
    }

    // Store selected items for later use
    localStorage.setItem('selectedItems', JSON.stringify(selectedItemIds));
    
    // Navigate to first selected item
    navigate(`/return-reason/${selectedItemIds[0]}`);
  };

  if (!order) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Select Items to Return</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <p className="text-gray-600">Order #{order.order_number}</p>
        <p className="text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
      </div>
      
      <div className="border-t border-gray-200 mt-4">
        {order.line_items.map(item => (
          <div 
            key={item.id} 
            className={`flex items-center p-4 border-b border-gray-200 ${
              selectedItems[item.id] ? 'bg-blue-50' : ''
            }`}
          >
            <input
              type="checkbox"
              id={`item-${item.id}`}
              checked={!!selectedItems[item.id]}
              onChange={() => handleItemSelect(item.id)}
              className="mr-4 h-5 w-5"
            />
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-gray-600">
                {item.variant_title}
              </p>
              <p className="text-gray-600">
                Quantity: {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleContinue}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default OrderDetailsPage;