// src/App.js
import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/Common/Navbar';
import LandingPage from './components/LandingPage/LandingPage';
import Dashboard from './components/Dashboard/Dashboard';
import ProfilePage from './components/ProfilePage/ProfilePage';
import PrivateRoute from './components/Common/PrivateRoute';
import LoginModal from './components/Auth/LoginModal';
import ProjectManager from './components/Projects/ProjectManager';
import ProjectDetails from './components/Projects/ProjectDetails';
import { AuthProvider } from './components/Auth/AuthContext';
import MainLayout from './components/Common/MainLayout'; // Importamos el layout
import FriendsManager from './components/Dashboard/FriendsManager'; // Ejemplo, ajústalo según tu estructura
import HistoryReports from './components/Dashboard/HistoryReports';

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
            <Route path="/" element={<LandingPage openLoginModal={openLoginModal} />} />
            
            {/* Rutas privadas que comparten un layout común */}
            <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectManager />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/friends" element={<FriendsManager />} />
              <Route path="/history" element={<HistoryReports />} />
              {/* Aquí puedes agregar la ruta a /history cuando la implementes */}
            </Route>

            {/* Ruta privada para el perfil del usuario (si quieres que el perfil tenga el sidebar también, ponlo dentro del layout) */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
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
