import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import ReturnReasonPage from './pages/ReturnReasonPage';
import ReturnOptionsPage from './pages/ReturnOptionsPage';
import ReturnReviewPage from './pages/ReturnReviewPage';
import SuccessPage from './pages/SuccessPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/order-details" element={<OrderDetailsPage />} />
        <Route path="/return-reason/:itemId" element={<ReturnReasonPage />} />
        <Route path="/return-options/:itemId" element={<ReturnOptionsPage />} />
        <Route path="/return-review" element={<ReturnReviewPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;