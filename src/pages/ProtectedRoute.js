import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.bool);

  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
