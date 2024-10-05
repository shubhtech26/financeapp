// src/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from './utils/auth'; // Ensure this is the correct path to your auth.js file

const ProtectedRoute = ({ element }) => {
  // Check if user is authenticated
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />; // Redirect to login if not authenticated
  }

  return element; // Render the protected component
};

export default ProtectedRoute;
