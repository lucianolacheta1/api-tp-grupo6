import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      setIsAuthLoading(true);
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
          console.error('Error al verificar el usuario:', error);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsAuthLoading(false);
        });
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  const login = useCallback((token) => {
    localStorage.setItem('token', token);
    setIsAuthLoading(true);
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
        localStorage.removeItem('token');
      })
      .finally(() => {
        setIsAuthLoading(false);
      });
  }, []);

  const logout = useCallback(() => {
    setAuthenticatedUser(null);
    localStorage.removeItem('token');
  }, []);

  const value = useMemo(
    () => ({
      authenticatedUser,
      isAuthLoading,
      login,
      logout,
    }),
    [authenticatedUser, isAuthLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
