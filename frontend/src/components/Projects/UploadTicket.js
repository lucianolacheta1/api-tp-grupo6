import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

const UploadTicket = ({ onUpload, onUpdate, mode = 'create', initialValues, members, show, onHide }) => {
  const [showModal, setShowModal] = useState(show);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const handleClose = () => {
    onHide();
    setShowModal(false);
  };

  const isEditMode = mode === 'edit';

  const validationSchema = Yup.object().shape({
    date: Yup.date().required('La fecha es obligatoria'),
    paidBy: Yup.string().required('Debe seleccionar quién pagó el ticket'),
    divisionType: Yup.string().required('Debe seleccionar un tipo de división'),
    divisionMembers: Yup.lazy((value, { parent }) => {
      if (parent.divisionType === 'porcentual') {
        return Yup.array()
          .of(
            Yup.object().shape({
              memberId: Yup.string().required('Debe seleccionar un miembro'),
              percentage: Yup.number()
                .required('Debe ingresar un porcentaje')
                .min(0, 'El porcentaje no puede ser menor a 0')
                .max(100, 'El porcentaje no puede ser mayor a 100'),
            })
          )
          .test('sum-100', 'La suma de los porcentajes debe ser 100', (divisionMembers) =>
            Array.isArray(divisionMembers) &&
            divisionMembers.reduce((total, member) => total + (member.percentage || 0), 0) === 100
          );
      } else {
        // Equitativo
        return Yup.array()
          .of(
            Yup.object().shape({
              memberId: Yup.string(),
              percentage: Yup.number(),
            })
          )
          .test(
            'at-least-one',
            'Debe seleccionar al menos un miembro para dividir el gasto',
            (divisionMembers) => Array.isArray(divisionMembers) && divisionMembers.length > 0
          );
      }
    }),
    details: Yup.array().of(
      Yup.object().shape({
        product: Yup.string().required('El nombre del producto es obligatorio'),
        amount: Yup.number()
          .required('El monto es obligatorio')
          .positive('El monto debe ser positivo'),
      })
    ),
  });

  const defaultInitialValues = {
    date: '',
    details: [{ product: '', amount: '' }],
    paidBy: '',
    divisionType: 'equitativo',
    divisionMembers: [],
  };

  const formInitialValues = isEditMode && initialValues ? initialValues : defaultInitialValues;

  const handleSubmitForm = (values, { resetForm }) => {
    const ticketData = {
      date: values.date,
      products: values.details.map((d) => ({
        product: d.product,
        amount: Number(d.amount),
      })),
      paidBy: values.paidBy,
      divisionType: values.divisionType,
      divisionMembers: values.divisionMembers,
    };

    if (isEditMode && onUpdate) {
      onUpdate(ticketData);
    } else if (onUpload) {
      onUpload(ticketData);
    }

    resetForm();
    handleClose();
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditMode ? 'Editar Ticket' : 'Nuevo Ticket'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmitForm}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue // <- Importante: agregamos setFieldValue aquí
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
                  isInvalid={touched.date && !!errors.date}
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
                  isInvalid={touched.paidBy && !!errors.paidBy}
                >
                  <option value="">Seleccione un miembro</option>
                  {members && members.length > 0 ? (
                    members.map((member) => (
                      <option key={member._id} value={member.name}>
                        {member.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No hay miembros disponibles</option>
                  )}

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
                  isInvalid={touched.divisionType && !!errors.divisionType}
                >
                  <option value="equitativo">Equitativo</option>
                  <option value="porcentual">Porcentual</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.divisionType}
                </Form.Control.Feedback>
              </Form.Group>

              {values.divisionType === 'porcentual' ? (
                <FieldArray name="divisionMembers">
                  {({ push, remove }) => (
                    <div className="mt-3">
                      <h5>Miembros (Porcentual)</h5>
                      {values.divisionMembers.map((member, index) => (
                        <div key={index} className="mb-3" style={{ border: '1px solid #ccc', padding: '10px' }}>
                          <Form.Group controlId={`divisionMembers[${index}].memberId`}>
                            <Form.Label>Miembro</Form.Label>
                            <Form.Control
                              as="select"
                              name={`divisionMembers[${index}].memberId`}
                              value={member.memberId}
                              onChange={handleChange}
                              isInvalid={
                                touched.divisionMembers?.[index]?.memberId &&
                                !!errors.divisionMembers?.[index]?.memberId
                              }
                            >
                              <option value="">Seleccione un miembro</option>
                              {members.map((m) => (
                                <option key={m._id} value={m.name}>
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
                              isInvalid={
                                touched.divisionMembers?.[index]?.percentage &&
                                !!errors.divisionMembers?.[index]?.percentage
                              }
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
                      <Button
                        variant="secondary"
                        onClick={() => push({ memberId: '', percentage: 0 })}
                        className="mb-3"
                      >
                        Añadir Miembro
                      </Button>
                    </div>
                  )}
                </FieldArray>
              ) : (
                // Equitativo: Selección de miembros con checkbox
                <div className="mt-3">
                  <h5>Miembros (Equitativo)</h5>
                  {members.map((m) => {
                    const isChecked = values.divisionMembers.some((dm) => dm.memberId === m.name);
                    return (
                      <Form.Check
                        key={m._id}
                        type="checkbox"
                        label={m.name}
                        checked={isChecked}
                        onChange={() => {
                          let newDivisionMembers = [...values.divisionMembers];
                          if (isChecked) {
                            newDivisionMembers = newDivisionMembers.filter((dm) => dm.memberId !== m.name);
                          } else {
                            newDivisionMembers.push({ memberId: m.name });
                          }
                          setFieldValue('divisionMembers', newDivisionMembers);
                        }}
                      />
                    );
                  })}
                  {touched.divisionMembers && errors.divisionMembers && (
                    <div className="text-danger">{errors.divisionMembers}</div>
                  )}
                </div>
              )}

              <FieldArray name="details">
                {({ push, remove }) => (
                  <div className="mt-3">
                    <h5>Productos</h5>
                    {values.details.map((detail, index) => (
                      <div key={index} className="mb-3" style={{ border: '1px solid #ccc', padding: '10px' }}>
                        <Form.Group controlId={`details[${index}].product`}>
                          <Form.Label>Producto</Form.Label>
                          <Form.Control
                            type="text"
                            name={`details[${index}].product`}
                            placeholder="Nombre del producto"
                            value={detail.product}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.details?.[index]?.product && !!errors.details?.[index]?.product}
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
                            isInvalid={touched.details?.[index]?.amount && !!errors.details?.[index]?.amount}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.details?.[index]?.amount}
                          </Form.Control.Feedback>
                        </Form.Group>
                        {values.details.length > 1 && (
                          <Button variant="danger" onClick={() => remove(index)} className="mt-2">
                            Eliminar Producto
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="secondary" onClick={() => push({ product: '', amount: '' })} className="mt-3">
                      Añadir Producto
                    </Button>
                  </div>
                )}
              </FieldArray>
              <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
                {isSubmitting ? 'Cargando...' : (isEditMode ? 'Guardar Cambios' : 'Cargar')}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

UploadTicket.propTypes = {
  onUpload: PropTypes.func,
  onUpdate: PropTypes.func,
  mode: PropTypes.oneOf(['create', 'edit']),
  initialValues: PropTypes.object,
  members: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default UploadTicket;
