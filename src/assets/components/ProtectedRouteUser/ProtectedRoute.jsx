import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token'); // Check if token exists in localStorage

  // If there's no token, redirect to the login page
  if (!token) {
    return <Navigate to="/userlogin" />;
  }

  return element; // If token exists, allow access to the protected route
};

export default ProtectedRoute;
