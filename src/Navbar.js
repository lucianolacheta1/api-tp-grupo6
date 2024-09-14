import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ authenticatedUser, handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">SplitWise</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/features">Características</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pricing">Precios</Link>
            </li>
            <li className="nav-item">
              {authenticatedUser ? (
                <div className="d-flex align-items-center">
                  <img
                    src="user.jpg"
                    alt="Avatar"
                    width="30"
                    height="30"
                    className="rounded-circle me-2"
                  />
                  <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                      {authenticatedUser}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <li><button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button></li>
                    </ul>
                  </div>
                </div>
              ) : (
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal">
                  Iniciar sesión
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
