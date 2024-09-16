// src/components/FriendsManager.js
import React, { useState, useCallback } from 'react';
import { ListGroup, Button, Modal, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

function FriendsManager({ friends, setFriends }) {
  const [showModal, setShowModal] = useState(false);

  const handleAddFriend = useCallback(
    (values, { resetForm }) => {
      setFriends((prevFriends) => [
        ...prevFriends,
        { id: Date.now(), name: values.friendName },
      ]);
      resetForm();
      setShowModal(false);
    },
    [setFriends]
  );

  const validationSchema = Yup.object().shape({
    friendName: Yup.string().required('El nombre del amigo es obligatorio'),
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
            <ListGroup.Item key={friend.id}>
              <div className="d-flex justify-content-between align-items-center">
                <span>{friend.name}</span>
                <Button variant="outline-danger" size="sm">
                  Eliminar
                </Button>
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
            initialValues={{ friendName: '' }}
            validationSchema={validationSchema}
            onSubmit={handleAddFriend}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
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
  friends: PropTypes.array.isRequired,
  setFriends: PropTypes.func.isRequired,
};

export default React.memo(FriendsManager);
