import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Componente reutilizable para los campos del formulario
function InputField({ label, type, value, onChange, error, autocomplete }) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input 
        type={type} 
        className="form-control" 
        value={value} 
        onChange={onChange}
        autoComplete={autocomplete}
      />
      {error && <small className="text-danger">{error}</small>}
    </div>
  );
}

function LoginModal({ setAuthenticatedUser, view, setView }) {
  const navigate = useNavigate();
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

  const validateUsername = (username) => username.length >= 4;
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const handleFormSubmit = (isRegistering) => {
    const newErrors = {};
    
    if (!validateUsername(username)) newErrors.username = 'El nombre de usuario debe tener al menos 4 caracteres.';
    if (!validatePassword(password)) newErrors.password = 'La contraseña debe tener al menos 8 caracteres, incluir 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial.';
    
    if (isRegistering) {
      if (!validateEmail(email)) newErrors.email = 'El correo electrónico no es válido.';
      if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const userData = {
        username,
        email: isRegistering ? email : 'example@example.com'
      };
      
      // Guardar los datos en localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      // Actualizar el estado global de usuario autenticado
      setAuthenticatedUser(userData);

      const modalElement = document.getElementById('loginModal');
      if (modalElement) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
        }
      }
      navigate('/dashboard');
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
            <form>
              <InputField
                label="Nombre de Usuario"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={errors.username}
              />
              {view === 'register' && (
                <InputField
                  label="Correo Electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />
              )}
              <InputField
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autocomplete="current-password"
              />
              {view === 'register' && (
                <InputField
                  label="Confirmar Contraseña"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                />
              )}
            </form>
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
                  <button type="button" className="btn btn-primary" onClick={() => handleFormSubmit(false)}>Iniciar sesión</button>
                </div>
              </>
            ) : (
              <div>
                <button type="button" className="btn btn-secondary" onClick={() => setView('login')}>Volver</button>
                <button type="button" className="btn btn-primary" onClick={() => handleFormSubmit(true)}>Registrarse</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
