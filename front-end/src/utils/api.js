// src/api.js
const BASE_URL = 'http://192.168.1.12:8000';

export const requestOTP = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/request-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to request OTP');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (email, code) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/verify-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to verify OTP');
    }

    return data;
  } catch (error) {
    throw error;
  }
};
