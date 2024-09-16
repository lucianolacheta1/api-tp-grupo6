import React, { useState, useEffect } from 'react';

function LoginModal({ setAuthenticatedUser, view, setView }) {  // Recibimos view y setView desde App.js

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      window.bootstrap.Modal.getOrCreateInstance(modalElement);
      modalElement.addEventListener('hidden.bs.modal', () => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
      });
    }
  }, []);

  const validateUsername = (username) => {
    return username.length >= 4;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLoginSubmit = () => {
    const newErrors = {};

    if (!validateUsername(username)) {
      newErrors.username = 'El nombre de usuario debe tener al menos 4 caracteres.';
    }

    if (!validatePassword(password)) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres, incluir 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setAuthenticatedUser(username);

      const modalElement = document.getElementById('loginModal');
      if (modalElement) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();

          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
        }
      }
    }
  };

  const handleRegisterSubmit = () => {
    const newErrors = {};

    if (!validateUsername(username)) {
      newErrors.username = 'El nombre de usuario debe tener al menos 4 caracteres.';
    }

    if (!validateEmail(email)) {
      newErrors.email = 'El correo electrónico no es válido.';
    }

    if (!validatePassword(password)) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres, incluir 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setAuthenticatedUser(username);

      const modalElement = document.getElementById('loginModal');
      if (modalElement) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();

          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
        }
      }
    }
  };

  return (
    <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="loginModalLabel">
              {view === 'login' ? 'Iniciar sesión' : view === 'register' ? 'Registrarse' : 'Recuperar Contraseña'}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {view === 'login' && (
              <form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Nombre de Usuario</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {errors.username && <small className="text-danger">{errors.username}</small>}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <small className="text-danger">{errors.password}</small>}
                </div>
              </form>
            )}

            {view === 'register' && (
              <form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Nombre de Usuario</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {errors.username && <small className="text-danger">{errors.username}</small>}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <small className="text-danger">{errors.email}</small>}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <small className="text-danger">{errors.password}</small>}
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer d-flex justify-content-between">
            {view === 'login' ? (
              <>
                <div>
                  <a href="#!" onClick={() => setView('register')} className="text-primary">Registrarse</a> | 
                  <a href="#!" onClick={() => setView('recover')} className="text-primary ms-2">Recuperar Contraseña</a>
                </div>
                <div>
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                  <button type="button" className="btn btn-primary" onClick={handleLoginSubmit}>Iniciar sesión</button>
                </div>
              </>
            ) : (
              <div>
                <button type="button" className="btn btn-secondary" onClick={() => setView('login')}>Volver</button>
                <button type="button" className="btn btn-primary" onClick={handleRegisterSubmit}>
                  Registrarse
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;