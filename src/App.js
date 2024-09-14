import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import LandingPage from './LandingPage';
import LoginModal from './Login';

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [view, setView] = useState('login'); // Aquí añadimos el estado para manejar la vista del modal

  const handleLogout = () => {
    setAuthenticatedUser(null); // Esto reinicia la sesión
  };

  return (
    <Router>
      <div>
        <Navbar authenticatedUser={authenticatedUser} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<LandingPage setView={setView} />} /> {/* Pasamos setView a LandingPage */}
          <Route path="/features" element={<div>Características</div>} />
          <Route path="/pricing" element={<div>Precios</div>} />
        </Routes>
        <LoginModal setAuthenticatedUser={setAuthenticatedUser} view={view} setView={setView} /> {/* También lo pasamos a LoginModal */}
      </div>
    </Router>
  );
}

export default App;
