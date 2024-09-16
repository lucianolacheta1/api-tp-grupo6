// src/components/ProfilePage.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { authenticatedUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados para campos editables
  const [username, setUsername] = useState(authenticatedUser.username || '');
  const [email, setEmail] = useState(authenticatedUser.email || '');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('Español');
  const [profilePicture, setProfilePicture] = useState(null);

  // Estados para configuraciones de notificaciones
  const [notifications, setNotifications] = useState({
    friendRequest: false,
    addedToGroup: false,
    expenseChanges: false,
    paymentReceived: false,
    paymentPending: false,
  });

  const handleNotificationChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSave = () => {
    // Lógica para guardar cambios en el backend
    alert('Configuración guardada con éxito.');
  };

  const handleDeleteAccount = () => {
    // Lógica para eliminar la cuenta del usuario en el backend
    alert('Cuenta eliminada con éxito.');
    logout();
    navigate('/');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Información de Usuario</h2>
      <div className="row">
        <div className="col-md-3 text-center">
          <img
            src={profilePicture || '/assets/default-avatar.png'}
            alt="Foto de perfil"
            className="img-fluid rounded-circle mb-3"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
          <label className="btn btn-primary mb-3" htmlFor="fileInput">
            Cambiar foto de perfil
          </label>
          <input
            type="file"
            id="fileInput"
            className="d-none"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="col-md-9">
          <div className="mb-3">
            <label className="form-label">Nombre de Usuario</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* Otros campos de perfil */}
          <div className="mb-3">
            <label className="form-label">Número de Teléfono</label>
            <input
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Idioma</label>
            <select
              className="form-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>Español</option>
              <option>Inglés</option>
              {/* Otros idiomas */}
            </select>
          </div>
        </div>
      </div>

      {/* Configuración de Notificaciones */}
      <h2 className="mt-5">Configuración de notificaciones</h2>
      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          id="friendRequest"
          name="friendRequest"
          checked={notifications.friendRequest}
          onChange={handleNotificationChange}
        />
        <label className="form-check-label" htmlFor="friendRequest">
          Recibir notificaciones cuando un usuario me agregue como amigo.
        </label>
      </div>
      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          id="addedToGroup"
          name="addedToGroup"
          checked={notifications.addedToGroup}
          onChange={handleNotificationChange}
        />
        <label className="form-check-label" htmlFor="addedToGroup">
          Recibir notificaciones cuando un usuario me agregue a un grupo.
        </label>
      </div>
      <div className="form-check mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          id="expenseChanges"
          name="expenseChanges"
          checked={notifications.expenseChanges}
          onChange={handleNotificationChange}
        />
        <label className="form-check-label" htmlFor="expenseChanges">
          Recibir notificaciones cuando se añada, modifique o elimine un gasto.
        </label>
      </div>

      {/* Configuración de Gastos */}
      <h2 className="mt-5">Configuración de gastos</h2>
      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          id="paymentReceived"
          name="paymentReceived"
          checked={notifications.paymentReceived}
          onChange={handleNotificationChange}
        />
        <label className="form-check-label" htmlFor="paymentReceived">
          Recibir notificaciones cuando reciba un pago.
        </label>
      </div>
      <div className="form-check mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          id="paymentPending"
          name="paymentPending"
          checked={notifications.paymentPending}
          onChange={handleNotificationChange}
        />
        <label className="form-check-label" htmlFor="paymentPending">
          Recibir notificaciones cuando tenga un pago pendiente.
        </label>
      </div>

      <div className="d-flex justify-content-between">
        <button className="btn btn-danger" onClick={handleDeleteAccount}>
          Eliminar cuenta
        </button>
        <button className="btn btn-secondary" onClick={logout}>
          Cerrar sesión
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Guardar
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
