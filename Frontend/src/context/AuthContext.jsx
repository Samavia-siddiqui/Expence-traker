import { createContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api/auth.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token and user exist in localStorage
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        // Handle malformed JSON
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    try {
      const data = await apiLogin({ email, password });
      setUser({ _id: data._id, name: data.name, email: data.email });
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed. Please try again.';
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      const data = await apiSignup({ name, email, password });
      setUser({ _id: data._id, name: data.name, email: data.email });
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed. Please try again.';
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
