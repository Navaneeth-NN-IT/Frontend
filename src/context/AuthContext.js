import React, { createContext, useState, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // --- THIS IS THE KEY FIX ---
  // Initialize the state directly from the service.
  // This ensures that on page reload, the user data is available immediately.
  const [user, setUser] = useState(authService.getCurrentUser());
  
  // We no longer need a complex loading state for this specific issue.
  const [loading, setLoading] = useState(false); 

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};