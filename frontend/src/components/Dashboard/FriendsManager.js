import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Modal, Form, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getFriends, addFriend, deleteFriend } from '../../api';

function FriendsManager() {
  const [friends, setFriends] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState(null);
  const [modalErrorMessage, setModalErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [globalErrorMessage, setGlobalErrorMessage] = useState('');

  const fetchFriends = async () => {
    try {
      const data = await getFriends();
      setFriends(data);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setGlobalErrorMessage('No se pudo cargar la lista de amigos. Por favor, inténtelo más tarde.');
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleAddFriend = async (values, { resetForm }) => {
    try {
      const newFriendData = { name: values.friendName, email: values.friendEmail };
      const response = await addFriend(newFriendData);
      setFriends((prevFriends) => [...prevFriends, response.friend]);
      resetForm();
      setModalErrorMessage('');
      setSuccessMessage('Amigo añadido exitosamente.');
      setShowModal(false);
    } catch (error) {
      console.error('Error adding friend:', error);
      setModalErrorMessage('No se pudo añadir el amigo. Por favor, inténtelo más tarde.');
    }
  };

  const handleDeleteClick = (friend) => {
    setFriendToDelete(friend);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!friendToDelete) return;
    try {
      await deleteFriend(friendToDelete._id);
      setFriends((prevFriends) => prevFriends.filter((f) => f._id !== friendToDelete._id));
      setGlobalErrorMessage('');
      setSuccessMessage('Amigo eliminado exitosamente.');
    } catch (error) {
      console.error('Error deleting friend:', error);
      setGlobalErrorMessage('No se pudo eliminar el amigo. Por favor, inténtelo más tarde.');
    } finally {
      setShowDeleteModal(false);
      setFriendToDelete(null);
    }
  };

  const validationSchema = Yup.object().shape({
    friendName: Yup.string().required('El nombre del amigo es obligatorio'),
    friendEmail: Yup.string().email('Email inválido').required('El email es obligatorio'),
  });

  const handleCloseModal = () => {
    setShowModal(false);
    setModalErrorMessage('');
  };

  return (
    <div>
      <h3>Mis Amigos</h3>

      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}
      {globalErrorMessage && (
        <Alert variant="danger" onClose={() => setGlobalErrorMessage('')} dismissible>
          {globalErrorMessage}
        </Alert>
      )}

      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
        Añadir Amigo
      </Button>

      {friends.length === 0 ? (
        <p>No tienes amigos aún.</p>
      ) : (
        <ListGroup>
          {friends.map((friend) => (
            <ListGroup.Item key={friend._id}>
              <div className="d-flex justify-content-between align-items-center">
                <span>{friend.name} - {friend.email}</span>
                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(friend)}>
                  Eliminar
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Modal para añadir amigo */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Amigo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalErrorMessage && (
            <Alert variant="danger" onClose={() => setModalErrorMessage('')} dismissible>
              {modalErrorMessage}
            </Alert>
          )}
          <Formik
            initialValues={{ friendName: '', friendEmail: '' }}
            validationSchema={validationSchema}
            onSubmit={handleAddFriend}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="friendName">
                  <Form.Label>Nombre del Amigo</Form.Label>
                  <Form.Control
                    type="text"
                    name="friendName"
                    placeholder="Ingresa el nombre del amigo"
                    value={values.friendName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.friendName && !!errors.friendName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.friendName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="friendEmail" className="mt-3">
                  <Form.Label>Email del Amigo</Form.Label>
                  <Form.Control
                    type="email"
                    name="friendEmail"
                    placeholder="Ingresa el email del amigo"
                    value={values.friendEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.friendEmail && !!errors.friendEmail}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.friendEmail}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
                  {isSubmitting ? 'Añadiendo...' : 'Añadir'}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar a <strong>{friendToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default React.memo(FriendsManager);
