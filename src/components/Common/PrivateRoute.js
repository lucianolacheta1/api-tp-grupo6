// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';

function PrivateRoute({ children }) {
  const { authenticatedUser } = useContext(AuthContext);

  return authenticatedUser ? children : <Navigate to="/" />;
}

export default PrivateRoute;
