// client/src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const lookupOrder = async (orderId, email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/lookup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to lookup order');
    }

    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

export const submitReturn = async (returnData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/returns/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(returnData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit return');
    }

    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};