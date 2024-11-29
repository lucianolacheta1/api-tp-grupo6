// src/components/Projects/ProjectDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ListGroup, Modal, Form, Row, Col } from 'react-bootstrap';
import { getProjectById, updateProject } from '../../api';
import Sidebar from '../Dashboard/Sidebar';
import { Formik } from 'formik';
import * as Yup from 'yup';
import UploadTicket from './UploadTicket';
import TicketCard from './TicketCard';

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(id);
        setProject(data);
      } catch (error) {
        console.error('Error fetching project details:', error);
        setErrorMessage('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleAddMember = async (values, { resetForm }) => {
    try {
      const updatedProject = {
        ...project,
        members: [...(project.members || []), values.memberName],
      };
      await updateProject(id, updatedProject);
      setProject(updatedProject);
      setShowMemberModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleAddExpense = async (values, { resetForm }) => {
    try {
      const newExpense = {
        description: values.description,
        amount: values.amount,
      };
      const updatedProject = {
        ...project,
        expenses: [...(project.expenses || []), newExpense],
      };
      await updateProject(id, updatedProject);
      setProject(updatedProject);
      setShowExpenseModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleUploadTicket = async (ticketData) => {
    try {
      const updatedProject = {
        ...project,
        tickets: [...(project.tickets || []), ticketData],
      };
      await updateProject(id, updatedProject);
      setProject(updatedProject);
    } catch (error) {
      console.error('Error uploading ticket:', error);
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!project) {
    return <p>{errorMessage || 'Proyecto no encontrado'}</p>;
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <h3>{project.name}</h3>
        <p>{project.detail || 'Sin descripción'}</p>

        <h4>Tickets</h4>
        <UploadTicket onUpload={handleUploadTicket} />
        {project.tickets && project.tickets.length > 0 ? (
          <Row xs={1} md={3} className="g-4">
            {project.tickets.map((ticket, index) => (
              <Col key={index}>
                <TicketCard ticket={ticket} />
              </Col>
            ))}
          </Row>
        ) : (
          <p>No hay tickets cargados.</p>
        )}

        <h4 className="mt-4">Miembros</h4>
        <Button variant="primary" onClick={() => setShowMemberModal(true)} className="mb-3">
          Añadir Miembro
        </Button>
        <ListGroup>
          {project.members.length === 0 ? (
            <p>No hay miembros en este proyecto.</p>
          ) : (
            project.members.map((member, index) => (
              <ListGroup.Item key={index}>{member}</ListGroup.Item>
            ))
          )}
        </ListGroup>

        <h4 className="mt-4">Gastos</h4>
        <Button variant="primary" onClick={() => setShowExpenseModal(true)} className="mb-3">
          Añadir Gasto
        </Button>
        <ListGroup>
          {project.expenses && project.expenses.length > 0 ? (
            project.expenses.map((expense, index) => (
              <ListGroup.Item key={index}>
                {expense.description}: {expense.amount}
              </ListGroup.Item>
            ))
          ) : (
            <p>No hay gastos registrados.</p>
          )}
        </ListGroup>

        {/* Modal para añadir miembro */}
        <Modal show={showMemberModal} onHide={() => setShowMemberModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Añadir Miembro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{ memberName: '' }}
              validationSchema={Yup.object({
                memberName: Yup.string().required('El nombre del miembro es obligatorio'),
              })}
              onSubmit={handleAddMember}
            >
              {({ values, handleChange, handleSubmit, errors, touched }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="memberName">
                    <Form.Label>Nombre del Miembro</Form.Label>
                    <Form.Control
                      type="text"
                      name="memberName"
                      value={values.memberName}
                      onChange={handleChange}
                      isInvalid={touched.memberName && !!errors.memberName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.memberName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-3">
                    Añadir
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>

        {/* Modal para añadir gasto */}
        <Modal show={showExpenseModal} onHide={() => setShowExpenseModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Añadir Gasto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{ description: '', amount: '' }}
              validationSchema={Yup.object({
                description: Yup.string().required('La descripción es obligatoria'),
                amount: Yup.number()
                  .required('El monto es obligatorio')
                  .positive('El monto debe ser positivo'),
              })}
              onSubmit={handleAddExpense}
            >
              {({ values, handleChange, handleSubmit, errors, touched }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="description">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      isInvalid={touched.description && !!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="amount" className="mt-3">
                    <Form.Label>Monto</Form.Label>
                    <Form.Control
                      type="number"
                      name="amount"
                      value={values.amount}
                      onChange={handleChange}
                      isInvalid={touched.amount && !!errors.amount}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.amount}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-3">
                    Añadir
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default ProjectDetails;
