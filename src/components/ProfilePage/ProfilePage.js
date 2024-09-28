import React, { useState, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

function ProfilePage() {
  const { authenticatedUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados para campos editables
  const [username, setUsername] = useState(authenticatedUser.username || '');
  const [email, setEmail] = useState(authenticatedUser.email || '');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  // Estados para configuraciones de notificaciones
  const [notifications, setNotifications] = useState({
    friendRequest: false,
    addedToGroup: false,
    expenseChanges: false,
    paymentReceived: false,
    paymentPending: false,
  });

  // Estados para cambio de contraseña
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleChangePassword = () => {
    // Lógica para cambiar la contraseña en el backend
    alert('Contraseña cambiada con éxito.');
    setShowPasswordForm(false);
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-3 py-3">Información de Usuario</h2>
      <div className="row shadow-lg rounded-3 border border-gray-300 p-3">
        <div className="col-md-3 text-center pt-5">
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
            <button
              className="btn btn-secondary"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              Cambiar Contraseña
            </button>
            {showPasswordForm && (
              <div className="mt-3">
                <div className="mb-3">
                  <label className="form-label">Contraseña Actual</label>
                  <input
                    type="password"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nueva Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary" onClick={handleChangePassword}>
                  Cambiar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Configuración de Notificaciones */}
      <h2 className="mt-5 mb-3">Configuración de notificaciones</h2>
      <div className="row shadow-lg rounded-3 border border-gray-300 pt-4 p-3 pb-0">
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
      </div>

      {/* Configuración de Gastos */}
      <h2 className="mt-5 mb-3">Configuración de gastos</h2>
      <div className='row shadow-lg rounded-3 border border-gray-300 pt-4 p-3 pb-0 mb-4'>
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
      </div>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
          Eliminar cuenta
        </button>
        <button className="btn btn-secondary" onClick={logout}>
          Cerrar sesión
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Guardar
        </button>
      </div>


      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación de Cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default ProfilePage;