import React, { useContext, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

function LoginModal({ showModal, setShowModal, modalView, setModalView }) {
  const { login, authenticatedUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticatedUser) {
      navigate('/dashboard');
    }
  }, [authenticatedUser, navigate]);

  const handleClose = () => {
    setShowModal(false);
    setModalView('login');
  };

  // Esquemas de validación con Yup
  const validationSchemas = {
    login: Yup.object().shape({
      email: Yup.string().email('Correo electrónico inválido').required('El correo electrónico es obligatorio'),
      password: Yup.string()
        .required('La contraseña es obligatoria')
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    }),
    register: Yup.object().shape({
      username: Yup.string().required('El nombre de usuario es obligatorio'),
      email: Yup.string()
        .email('Correo electrónico inválido')
        .required('El correo electrónico es obligatorio'),
      password: Yup.string()
        .required('La contraseña es obligatoria')
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    }),
    recover: Yup.object().shape({
      email: Yup.string()
        .email('Correo electrónico inválido')
        .required('El correo electrónico es obligatorio'),
    }),
  };

  // Valores iniciales
  const initialValues = {
    username: '',
    email: '',
    password: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (modalView === 'login') {
        // Lógica de autenticación
        const response = await axios.post(`${API_URL}/login`, {
          email: values.email,
          password: values.password,
        });
        await login(response.data.token); // Este debería guardar el token y actualizar el contexto
        handleClose();
      } else if (modalView === 'register') {
        // Lógica de registro
        await axios.post(`${API_URL}/register`, {
          username: values.username,
          email: values.email,
          password: values.password,
        });
        alert('Registro exitoso, ahora puedes iniciar sesión.');
        setModalView('login');
      } else if (modalView === 'recover') {
        // Lógica de recuperación de contraseña
        await axios.post(`${API_URL}/recover`, {
          email: values.email,
        });
        alert('Se ha enviado un correo para restablecer tu contraseña.');
        handleClose();
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('Ha ocurrido un error. Por favor intenta nuevamente.');
    } finally {
      setSubmitting(false);
      resetForm();
    }
  };
  
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {modalView === 'login'
            ? 'Iniciar Sesión'
            : modalView === 'register'
            ? 'Registrarse'
            : 'Recuperar Contraseña'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[modalView]}
          onSubmit={handleSubmit}
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
              {modalView === 'register' && (
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Nombre de Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Ingresa tu nombre de usuario"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.username && errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
              )}
              {(modalView === 'login' || modalView === 'register') && (
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Ingresa tu correo"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.email && errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              )}
              {(modalView === 'login' || modalView === 'register') && (
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.password && errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
              )}
              {modalView === 'recover' && (
                <Form.Group className="mb-3" controlId="formRecoverEmail">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Ingresa tu correo para recuperar la contraseña"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.email && errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              )}
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{' '}
                    Procesando...
                  </>
                ) : modalView === 'login' ? (
                  'Iniciar Sesión'
                ) : modalView === 'register' ? (
                  'Registrarse'
                ) : (
                  'Enviar'
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        {modalView === 'login' ? (
          <>
            <span>
              ¿No tienes cuenta?{' '}
              <a href="#!" onClick={() => setModalView('register')}>
                Regístrate
              </a>
            </span>
            <span>
              {' '}
              |{' '}
              <a href="#!" onClick={() => setModalView('recover')}>
                ¿Olvidaste tu contraseña?
              </a>
            </span>
          </>
        ) : modalView === 'register' ? (
          <>
            <span>
              ¿Ya tienes cuenta?{' '}
              <a href="#!" onClick={() => setModalView('login')}>
                Inicia Sesión
              </a>
            </span>
          </>
        ) : (
          <span>
            <a href="#!" onClick={() => setModalView('login')}>
              Volver a Iniciar Sesión
            </a>
          </span>
        )}
      </Modal.Footer>
    </Modal>
  );
}

LoginModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  modalView: PropTypes.string.isRequired,
  setModalView: PropTypes.func.isRequired,
};

export default React.memo(LoginModal);
