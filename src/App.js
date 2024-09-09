import React from 'react';
import Navbar from './Navbar';
import LandingPage from './LandingPage';
import LoginModal from './Login';
import './App.css';


function App() {
  return (
    <div>
      <Navbar />
      <LandingPage />
      <LoginModal />
    </div>
  );
}

export default App;
