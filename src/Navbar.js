import React from 'react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="./LandingPage">SplitWise</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#features">Características</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#pricing">Precios</a>
            </li>
            <li className="nav-item">
              {/* Este es el botón que abrirá el modal */}
              <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal">
                Iniciar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
