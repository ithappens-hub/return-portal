// client/src/pages/SuccessPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function SuccessPage() {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
      <div className="mb-6">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-16 w-16 mx-auto text-green-500" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
      
      <h1 className="text-2xl font-semibold mb-4">Return Request Submitted!</h1>
      
      <p className="text-gray-600 mb-8">
        We've received your return request and will process it shortly.
        You will receive a confirmation email with further instructions.
      </p>
      
      <div className="p-4 bg-gray-50 rounded-md mb-8 inline-block mx-auto">
        <p className="font-medium">Return Instructions:</p>
        <ol className="text-left list-decimal pl-6 mt-2 space-y-1">
          <li>Pack your items securely.</li>
          <li>Print the return label (sent to your email).</li>
          <li>Drop off the package at any carrier location.</li>
        </ol>
      </div>
      
      <div className="mt-6">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

export default SuccessPage;