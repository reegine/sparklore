// src/pages/LoginPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    // In real app, you'd also validate email & send the login code
    navigate('/verify');
  };

  return (
    <div className="min-h-screen bg-[#fdfaf3] flex items-center justify-center px-4">
      <div className="bg-white border border-[#f2e9d5] rounded-lg p-8 max-w-md w-full shadow-md">
        <h1 className="text-2xl font-medium text-center text-[#3b322c]">Welcome to Sparklore!</h1>
        <p className="text-center text-[#3b322c] mt-2 mb-6">Enter your email and we will send you a login code</p>

        <div className="mb-4">
          <label className="block text-[#3b322c] mb-1">Email</label>
          <input
            type="email"
            placeholder="your.email@mail.com"
            className="w-full px-4 py-2 border border-[#f2e9d5] bg-[#fdfaf3] text-[#a8a29e] placeholder-[#a8a29e] rounded-md outline-none"
          />
        </div>

        <p className="text-sm text-[#c9c3bc] mb-4">Privacy</p>

        <button
          onClick={handleContinue}
          className="w-full bg-[#e9d6a9] text-[#3b322c] text-lg font-medium py-2 rounded-md hover:bg-[#e3c990] transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
