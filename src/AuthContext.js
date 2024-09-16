// src/AuthContext.js
import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    // Cargar el usuario desde localStorage al iniciar la aplicación
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setAuthenticatedUser(storedUser);
    }
  }, []);

  const login = useCallback((userData) => {
    setAuthenticatedUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setAuthenticatedUser(null);
    localStorage.removeItem('user');
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
