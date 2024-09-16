// src/components/ProjectDetails/ProjectDetails.js
import React, { useState, useCallback } from 'react';
import { Button, Modal, Form, ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

function ProjectDetails({ project, onBack, onUpdateProject }) {
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const handleAddExpense = useCallback(
    (values, { resetForm }) => {
      const newExpense = {
        id: Date.now(),
        description: values.description,
        amount: parseFloat(values.amount),
        date: new Date().toLocaleDateString(),
      };

      // Actualizar los gastos del proyecto
      const updatedProject = {
        ...project,
        expenses: [...project.expenses, newExpense],
      };

      onUpdateProject(updatedProject);
      resetForm();
      setShowExpenseModal(false);
    },
    [project, onUpdateProject]
  );

  const validationSchema = Yup.object().shape({
    description: Yup.string().required('La descripción es obligatoria'),
    amount: Yup.number()
      .required('El monto es obligatorio')
      .positive('El monto debe ser positivo'),
  });

  // Calcular cuánto debe cada miembro
  const totalAmount = project.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const membersCount = project.members.length || 1; // Evitar división por cero
  const amountPerMember = totalAmount / membersCount;

  return (
    <div>
      <Button variant="link" onClick={onBack}>
        &larr; Volver a Proyectos
      </Button>
      <h3>{project.name}</h3>
      <p>{project.description}</p>

      <h4>Gastos</h4>
      <Button variant="primary" onClick={() => setShowExpenseModal(true)} className="mb-3">
        Añadir Gasto
      </Button>
      {project.expenses.length === 0 ? (
        <p>No hay gastos registrados.</p>
      ) : (
        <ListGroup>
          {project.expenses.map((expense) => (
            <ListGroup.Item key={expense.id}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{expense.description}</h5>
                  <p>
                    {expense.amount.toFixed(2)} - {expense.date}
                  </p>
                </div>
                <span>Compartido entre {membersCount} miembros</span>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <h4 className="mt-4">Miembros</h4>
      <Button variant="secondary" className="mb-3">
        Añadir Miembro
      </Button>
      {project.members.length === 0 ? (
        <p>No hay miembros en este proyecto.</p>
      ) : (
        <ListGroup>
          {project.members.map((member) => (
            <ListGroup.Item key={member.id}>{member.name}</ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <h4 className="mt-4">Resumen</h4>
      <p>Total gastado: {totalAmount.toFixed(2)}</p>
      <p>Cada miembro debe: {amountPerMember.toFixed(2)}</p>

      {/* Modal para añadir gasto */}
      <Modal show={showExpenseModal} onHide={() => setShowExpenseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Gasto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ description: '', amount: '' }}
            validationSchema={validationSchema}
            onSubmit={handleAddExpense}
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
                <Form.Group controlId="description">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    placeholder="Descripción del gasto"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.description && errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="amount">
                  <Form.Label>Monto</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    placeholder="Monto del gasto"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.amount && errors.amount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.amount}
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

ProjectDetails.propTypes = {
  project: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onUpdateProject: PropTypes.func.isRequired,
};

export default React.memo(ProjectDetails);
