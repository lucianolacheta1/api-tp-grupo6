import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import LandingPage from './LandingPage';
import LoginModal from './Login';

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  const handleLogout = () => {
    setAuthenticatedUser(null); // Esto reinicia la sesión
  };

  return (
    <Router>
      <div>
        <Navbar authenticatedUser={authenticatedUser} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<div>Características</div>} />
          <Route path="/pricing" element={<div>Precios</div>} />
        </Routes>
        <LoginModal setAuthenticatedUser={setAuthenticatedUser} />
      </div>
    </Router>
  );
}

export default App;
