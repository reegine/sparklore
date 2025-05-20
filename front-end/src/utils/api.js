// src/api.js
const BASE_URL = 'http://192.168.1.12:8000';

// Helper function to store auth data
const storeAuthData = (data) => {
  // Decode the JWT to get the expiration time
  const decodedToken = JSON.parse(atob(data.access.split('.')[1]));
  const expiresAt = decodedToken.exp * 1000; // Convert to milliseconds
  
  localStorage.setItem('authData', JSON.stringify({
    token: data.access,
    refreshToken: data.refresh, // Store refresh token if needed
    email: data.user.email,
    expiresAt: expiresAt
  }));
};

// Helper function to get auth data
export const getAuthData = () => {
  const authData = localStorage.getItem('authData');
  return authData ? JSON.parse(authData) : null;
};

// Helper function to check if user is logged in
export const isLoggedIn = () => {
  const authData = getAuthData();
  if (!authData) return false;
  
  // If expiresAt is missing, assume token is valid
  if (!authData.expiresAt) return true;
  
  return authData.expiresAt > new Date().getTime();
};


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
  console.log('Verifying OTP for:', email, code);
  try {
    const response = await fetch(`${BASE_URL}/auth/verify-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();
    console.log('Verify OTP response:', data); // Add this line

    if (!response.ok) {
      throw new Error(data.error || 'Failed to verify OTP');
    }
    
    // Store the authentication data
    storeAuthData(data);
    console.log('Auth data stored:', getAuthData()); // Add this line

    return data;
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
};

// Add logout function
export const logout = () => {
  localStorage.removeItem('authData');
};
