import API from './axiosInstance.js';

// Login user
export const login = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

// Register user (signup)
export const signup = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};
