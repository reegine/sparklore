// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestOTP } from '../../utils/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleContinue = async () => {
    try {
      await requestOTP(email);
      navigate('/verify', { state: { email } });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="min-h-screen bg-[#fdfaf3] flex items-center justify-center px-4 relative">
      <div className="bg-white border border-[#f2e9d5] rounded-lg p-8 max-w-md w-full shadow-md">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 flex items-center text-[#3b322c] font-medium hover:text-[#e9d6a9] transition"
          aria-label="Go back"
        >
          <span className="mr-2 text-lg">&#8592;</span> Back
        </button>
        <h1 className="text-2xl font-medium text-center text-[#3b322c]">Welcome to Sparklore!</h1>
        <p className="text-center text-[#3b322c] mt-2 mb-6">Enter your email and we will send you a login code</p>

        <div className="mb-4">
          <label className="block text-[#3b322c] mb-1">Email</label>
          <input
            type="email"
            placeholder="your.email@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-[#f2e9d5] bg-[#fdfaf3] text-[#a8a29e] placeholder-[#a8a29e] rounded-md outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

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
