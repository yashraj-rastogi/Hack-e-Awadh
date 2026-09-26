import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { StoreLandingPage } from './pages/StoreLandingPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ReceiptPage } from './pages/ReceiptPage';
import { MerchantDashboardPage } from './pages/MerchantDashboardPage';
import { MerchantLoginPage } from './pages/MerchantLoginPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<StoreLandingPage />} />
          <Route path="/s/:storeId" element={<StoreLandingPage />} />
          <Route path="/s/:storeId/checkout" element={<CheckoutPage />} />
          <Route path="/s/:storeId/receipt/:receiptId" element={<ReceiptPage />} />
          <Route path="/merchant/login" element={<MerchantLoginPage />} />
          <Route path="/merchant/dashboard" element={<MerchantDashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
