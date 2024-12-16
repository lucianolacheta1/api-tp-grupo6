import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Modal, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getFriends, addFriend } from '../../api';

function FriendsManager() {
  const [friends, setFriends] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchFriends = async () => {
    try {
      const data = await getFriends();
      setFriends(data);
    } catch (error) {
      console.error('Error fetching friends:', error);
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
      setShowModal(false);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const validationSchema = Yup.object().shape({
    friendName: Yup.string().required('El nombre del amigo es obligatorio'),
    friendEmail: Yup.string().email('Email inválido').required('El email es obligatorio'),
  });

  return (
    <div>
      <h3>Mis Amigos</h3>
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
                {/* Si implementas eliminación de amigos en el backend:
                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteFriend(friend._id)}>
                  Eliminar
                </Button> */}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Modal para añadir amigo */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Amigo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                    isInvalid={touched.friendName && errors.friendName}
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
                    isInvalid={touched.friendEmail && errors.friendEmail}
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
    </div>
  );
}

FriendsManager.propTypes = {
  // Ya no necesitamos recibir friends y setFriends desde props, ya que lo manejamos internamente.
};

export default React.memo(FriendsManager);
