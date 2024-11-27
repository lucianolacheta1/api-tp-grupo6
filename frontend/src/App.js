// src/App.js
import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/Common/Navbar';
import LandingPage from './components/LandingPage/LandingPage';
import Dashboard from './components/Dashboard/Dashboard';
import ProfilePage from './components/ProfilePage/ProfilePage';
import PrivateRoute from './components/Common/PrivateRoute';
import LoginModal from './components/Auth/LoginModal';
import ProjectsList from './components/Projects/ProjectsList';
import { AuthProvider } from './components/Auth/AuthContext';



function App() {
  // Estado para manejar el modal de inicio de sesión
  const [showModal, setShowModal] = useState(false);
  const [modalView, setModalView] = useState('login');

  const openLoginModal = useCallback((view = 'login') => {
    setModalView(view);
    setShowModal(true);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div>
          <NavigationBar openLoginModal={openLoginModal} />
          <Routes>
            <Route
              path="/"
              element={<LandingPage openLoginModal={openLoginModal} />}
            />
            {/* Rutas públicas adicionales */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <ProjectsList />
                </PrivateRoute>
              }
            />
            {/* Ruta para manejar páginas no encontradas */}
            <Route path="*" element={<div>Página no encontrada</div>} />
          </Routes>
          {/* Modal de inicio de sesión */}
          <LoginModal
            showModal={showModal}
            setShowModal={setShowModal}
            modalView={modalView}
            setModalView={setModalView}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
