// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login'; // Your login component
import Dashboard from './components/Dashboard'; // Your protected component
import ProtectedRoute from './ProtectedRoute'; // Your protected route component
import { isLoggedIn } from './utils/auth'; // Importing the authentication utility
import AssetList from './components/Dashboard';
import AssetPage from './components/AssetPage';
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is logged in when the app mounts
  useEffect(() => {
    setIsAuthenticated(isLoggedIn()); // Check if the user is authenticated
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Login setIsAuthenticated={setIsAuthenticated} />} // Pass the setter to Login component
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute element={<AssetPage/>}  /> // Protect the Dashboard route
          } 
        />
       <Route 
          path="/demo" 
          element= {<AssetPage/>} // Pass the setter to Login component
        />

      </Routes>
    </Router>
  );
};

export default App;
