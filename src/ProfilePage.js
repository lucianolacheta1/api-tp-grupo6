import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilePage({ authenticatedUser, setAuthenticatedUser }) {
  const [username, setUsername] = useState(authenticatedUser.username || '');
  const [email, setEmail] = useState(authenticatedUser.email || '');
  const [phone, setPhone] = useState(authenticatedUser.phone || 'Sin número registrado');
  const [language, setLanguage] = useState(authenticatedUser.language || 'Español');
  
  // Estado para manejar la imagen de perfil
  const [profilePicture, setProfilePicture] = useState('user.jpg'); 

  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthenticatedUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios en la configuración del usuario
    alert('Configuración guardada con éxito.');
  };

  const handleDeleteAccount = () => {
    // Aquí iría la lógica para eliminar la cuenta del usuario
    alert('Cuenta eliminada con éxito.');
    setAuthenticatedUser(null);
    navigate('/');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      // Creamos una URL temporal para mostrar la imagen seleccionada
      const imageURL = URL.createObjectURL(file);
      setProfilePicture(imageURL); // Actualizamos el estado de la imagen de perfil
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Información de usuario</h2>
      <div className="row">
        <div className="col-md-3 text-center">
          {/* La imagen de perfil que se puede cambiar */}
          <img
            src={profilePicture} // Usamos la imagen que está en el estado
            alt="Foto de perfil"
            className="img-fluid rounded-circle mb-3"
            style={{ width: '150px', height: '150px' }}
          />
          <label className="btn btn-primary mb-3" htmlFor="fileInput">
            Cambiar foto de perfil
          </label>
          <input
            type="file"
            id="fileInput"
            className="d-none"
            onChange={handleFileChange} // Manejamos el cambio de archivo
          />
        </div>
        <div className="col-md-9">
          <div className="mb-3">
            <strong>Nombre de usuario:</strong> {username}
            <button className="btn btn-link" onClick={() => setUsername(prompt('Edita tu nombre de usuario', username))}>Editar</button>
          </div>
          <div className="mb-3">
            <strong>Dirección de correo electrónico:</strong> {email}
            <button className="btn btn-link" onClick={() => setEmail(prompt('Edita tu correo electrónico', email))}>Editar</button>
          </div>
          <div className="mb-3">
            <strong>Número de teléfono:</strong> {phone}
            <button className="btn btn-link" onClick={() => setPhone(prompt('Edita tu número de teléfono', phone))}>Editar</button>
          </div>
          <div className="mb-3">
            <strong>Idioma:</strong> {language}
            <button className="btn btn-link" onClick={() => setLanguage(prompt('Edita tu idioma', language))}>Editar</button>
          </div>
          <div className="mb-3">
            <strong>Contraseña:</strong> ****** 
            <button className="btn btn-link">Editar</button>
          </div>
        </div>
      </div>

      {/* Configuración de Notificaciones */}
      <h2 className="mt-5">Configuración de notificaciones</h2>
      <div className="form-check mb-2">
        <input className="form-check-input" type="checkbox" />
        <label className="form-check-label">
          Recibir notificaciones cuando un usuario me agregue como amigo.
        </label>
      </div>
      <div className="form-check mb-2">
        <input className="form-check-input" type="checkbox" />
        <label className="form-check-label">
          Recibir notificaciones cuando un usuario me agregue a un grupo.
        </label>
      </div>
      <div className="form-check mb-4">
        <input className="form-check-input" type="checkbox" />
        <label className="form-check-label">
          Recibir notificaciones cuando se añada, modifique o elimine un gasto.
        </label>
      </div>

      {/* Configuración de Gastos */}
      <h2 className="mt-5">Configuración de gastos</h2>
      <div className="form-check mb-2">
        <input className="form-check-input" type="checkbox" />
        <label className="form-check-label">
          Recibir notificaciones cuando reciba un pago.
        </label>
      </div>
      <div className="form-check mb-4">
        <input className="form-check-input" type="checkbox" />
        <label className="form-check-label">
          Recibir notificaciones cuando tenga un pago pendiente.
        </label>
      </div>

      <div className="d-flex justify-content-between">
        <button className="btn btn-danger" onClick={handleDeleteAccount}>Eliminar cuenta</button>
        <button className="btn btn-secondary" onClick={handleLogout}>Cerrar sesión</button>
        <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
      </div>
    </div>
  );
}

export default ProfilePage;
