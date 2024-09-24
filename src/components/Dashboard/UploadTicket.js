// src/components/Dashboard/UploadTicket.js
import React, { useState } from 'react';
import { Button, Form, Modal} from 'react-bootstrap';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

const UploadTicket = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = (values, { resetForm }) => {
    if (file) {
      const ticketData = {
        file,
        details: values.details,
      };
      onUpload(ticketData);
      setFile(null);
      resetForm();
      setShowModal(false);
    }
  };

  const validationSchema = Yup.object().shape({
    details: Yup.array().of(
      Yup.object().shape({
        product: Yup.string().required('El nombre del producto es obligatorio'),
        amount: Yup.number().required('El monto es obligatorio').positive('El monto debe ser positivo'),
      })
    ),
  });

  return (
    <div>
      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
        Cargar mi Ticket
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ details: [{ product: '', amount: '' }] }}
            validationSchema={validationSchema}
            onSubmit={handleUpload}
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
                <Form.Group>
                <Form.Label>Subir Imagen del Ticket</Form.Label>
                  <Form.Control
                    type="file"
                    id="upload-ticket-file"
                    onChange={handleFileChange} 
                  />
                </Form.Group>
                <FieldArray name="details">
                  {({ push, remove }) => (
                    <div>
                      {values.details.map((detail, index) => (
                        <div key={index} className="mb-3">
                          <Form.Group controlId={`details[${index}].product`}>
                            <Form.Label>Producto</Form.Label>
                            <Form.Control
                              type="text"
                              name={`details[${index}].product`}
                              placeholder="Nombre del producto"
                              value={detail.product}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.details?.[index]?.product && errors.details?.[index]?.product}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.details?.[index]?.product}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group controlId={`details[${index}].amount`}>
                            <Form.Label>Monto</Form.Label>
                            <Form.Control
                              type="number"
                              name={`details[${index}].amount`}
                              placeholder="Monto del producto"
                              value={detail.amount}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.details?.[index]?.amount && errors.details?.[index]?.amount}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.details?.[index]?.amount}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Button variant="danger" onClick={() => remove(index)} className="mb-2 mt-3">
                            Eliminar Producto
                          </Button>
                        </div>
                      ))}
                      <Button variant="secondary" onClick={() => push({ product: '', amount: '' })} className='mb-2'>
                        Añadir Producto
                      </Button>
                    </div>
                  )}
                </FieldArray>
                <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
                  {isSubmitting ? 'Cargando...' : 'Cargar'}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

UploadTicket.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default UploadTicket;