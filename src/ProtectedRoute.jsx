import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { GlobalContext } from './GlobalContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(GlobalContext);

  if (loading) {
    return <Spin tip="Logging out..."></Spin>;
  }

  console.log("Authenticated",isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
