// src/components/Dashboard/UploadTicket.js
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

const UploadTicket = ({ onUpload, members }) => {
  const [showModal, setShowModal] = useState(false);

  const handleUpload = (values, { resetForm }) => {
    const ticketData = {
      date: values.date,
      products: values.details,
      paidBy: values.paidBy,
      divisionType: values.divisionType,
      divisionMembers: values.divisionMembers,
    };
    onUpload(ticketData);
    resetForm();
    setShowModal(false);
  };

  const validationSchema = Yup.object().shape({
    date: Yup.date().required('La fecha es obligatoria'),
    paidBy: Yup.string().required('Debe seleccionar quién pagó el ticket'),
    divisionType: Yup.string().required('Debe seleccionar un tipo de división'),
    divisionMembers: Yup.array().when('divisionType', {
      is: 'porcentual',
      then: Yup.array().of(
        Yup.object().shape({
          memberId: Yup.string().required('Debe seleccionar un miembro'),
          percentage: Yup.number()
            .required('Debe ingresar un porcentaje')
            .min(0, 'El porcentaje no puede ser menor a 0')
            .max(100, 'El porcentaje no puede ser mayor a 100'),
        })
      ).test('sum-100', 'La suma de los porcentajes debe ser 100', (divisionMembers) =>
        divisionMembers.reduce((total, member) => total + (member.percentage || 0), 0) === 100
      ),
    }),
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
            initialValues={{
              date: '',
              details: [{ product: '', amount: '' }],
              paidBy: '',
              divisionType: 'equitativo',
              divisionMembers: [],
            }}
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
                <Form.Group controlId="date">
                  <Form.Label>Fecha del Ticket</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={values.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.date && errors.date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.date}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="paidBy" className="mt-3">
                  <Form.Label>Pagado por</Form.Label>
                  <Form.Control
                    as="select"
                    name="paidBy"
                    value={values.paidBy}
                    onChange={handleChange}
                    isInvalid={touched.paidBy && errors.paidBy}
                  >
                    <option value="">Seleccione un miembro</option>
                    {members.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.paidBy}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="divisionType" className="mt-3">
                  <Form.Label>Tipo de División</Form.Label>
                  <Form.Control
                    as="select"
                    name="divisionType"
                    value={values.divisionType}
                    onChange={handleChange}
                    isInvalid={touched.divisionType && errors.divisionType}
                  >
                    <option value="equitativo">Equitativo</option>
                    <option value="porcentual">Porcentual</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.divisionType}
                  </Form.Control.Feedback>
                </Form.Group>

                {values.divisionType === 'porcentual' && (
                  <FieldArray name="divisionMembers">
                    {({ push, remove }) => (
                      <div>
                        {values.divisionMembers.map((member, index) => (
                          <div key={index} className="mb-3">
                            <Form.Group controlId={`divisionMembers[${index}].memberId`}>
                              <Form.Label>Miembro</Form.Label>
                              <Form.Control
                                as="select"
                                name={`divisionMembers[${index}].memberId`}
                                value={member.memberId}
                                onChange={handleChange}
                                isInvalid={touched.divisionMembers?.[index]?.memberId && errors.divisionMembers?.[index]?.memberId}
                              >
                                <option value="">Seleccione un miembro</option>
                                {members.map((m) => (
                                  <option key={m._id} value={m._id}>
                                    {m.name}
                                  </option>
                                ))}
                              </Form.Control>
                              <Form.Control.Feedback type="invalid">
                                {errors.divisionMembers?.[index]?.memberId}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId={`divisionMembers[${index}].percentage`} className="mt-2">
                              <Form.Label>Porcentaje</Form.Label>
                              <Form.Control
                                type="number"
                                name={`divisionMembers[${index}].percentage`}
                                value={member.percentage}
                                onChange={handleChange}
                                isInvalid={touched.divisionMembers?.[index]?.percentage && errors.divisionMembers?.[index]?.percentage}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.divisionMembers?.[index]?.percentage}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="danger" onClick={() => remove(index)} className="mt-2">
                              Eliminar Miembro
                            </Button>
                          </div>
                        ))}
                        <Button variant="secondary" onClick={() => push({ memberId: '', percentage: 0 })} className="mb-3">
                          Añadir Miembro
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                )}

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
                          <Form.Group controlId={`details[${index}].amount`} className="mt-2">
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
                          <Button variant="danger" onClick={() => remove(index)} className="mt-2">
                            Eliminar Producto
                          </Button>
                        </div>
                      ))}
                      <Button variant="secondary" onClick={() => push({ product: '', amount: 0 })} className="mt-3">
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
  members: PropTypes.array.isRequired,
};

export default UploadTicket;
