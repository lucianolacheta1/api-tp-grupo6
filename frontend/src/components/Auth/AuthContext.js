import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    // Cargar el token desde localStorage al iniciar la aplicación
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAuthenticatedUser(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token'); // Eliminar token inválido si falla
        });
    }
  }, []);

  const login = useCallback((token) => {
    // Guardar el token en localStorage y actualizar el usuario autenticado
    localStorage.setItem('token', token);
    axios
      .get('/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAuthenticatedUser(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user after login:', error);
        localStorage.removeItem('token'); // Eliminar token si falla
      });
  }, []);

  const logout = useCallback(() => {
    setAuthenticatedUser(null);
    localStorage.removeItem('token'); // Eliminar el token al cerrar sesión
  }, []);

  const value = useMemo(
    () => ({
      authenticatedUser,
      login,
      logout,
    }),
    [authenticatedUser, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
