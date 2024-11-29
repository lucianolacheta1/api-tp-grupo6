// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';

function PrivateRoute({ children }) {
  const { authenticatedUser, isAuthLoading } = useContext(AuthContext);
  const location = useLocation();

  // Agregar logs para depurar
  console.log('Estado del usuario autenticado:', authenticatedUser);
  console.log('Estado de carga de autenticación:', isAuthLoading);

  if (isAuthLoading) {
    return <div>Cargando...</div>;
  }

  return authenticatedUser ? children : <Navigate to="/" state={{ from: location }} replace />;
}

export default PrivateRoute;
