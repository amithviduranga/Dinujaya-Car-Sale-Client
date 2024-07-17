import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { GlobalContext } from './GlobalContext';

const ProtectedAdminRoute = ({ children }) => {
  const { isAdminAuthenticated } = useContext(GlobalContext);
  console.log(isAdminAuthenticated)
   console.log()
  if (!isAdminAuthenticated){
    return <Navigate to="/admin/login" replace />
  }
  return children;
};

export default ProtectedAdminRoute;
