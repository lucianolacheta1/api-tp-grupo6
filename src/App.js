import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import LandingPage from './LandingPage';
import LoginModal from './LoginModal';
import Dashboard from './Dashboard';
import ProfilePage from './ProfilePage';

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );
  const [view, setView] = useState('login');

  const handleLogout = () => {
    setAuthenticatedUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div>
        <Navbar authenticatedUser={authenticatedUser} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<LandingPage setView={setView} />} />
          <Route path="/features" element={<div>Características</div>} />
          <Route path="/pricing" element={<div>Precios</div>} />
          <Route path="/dashboard" element={authenticatedUser ? <Dashboard authenticatedUser={authenticatedUser} /> : <Navigate to="/" />} />
          <Route path="/profile" element={authenticatedUser ? <ProfilePage authenticatedUser={authenticatedUser} /> : <Navigate to="/" />}/>
        </Routes>
        <LoginModal setAuthenticatedUser={setAuthenticatedUser} view={view} setView={setView} />
      </div>
    </Router>
  );
}

export default App;
