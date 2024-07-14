import React, { createContext, useState, useEffect } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [response, setResponse] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userToken')); // Initialize from localStorage
  const [loading, setLoading] = useState(false);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <GlobalContext.Provider value={{ response, setResponse, isAuthenticated, setIsAuthenticated, loading, logout }}>
      {children}
    </GlobalContext.Provider>
  );
};
