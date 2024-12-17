import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import {
  getProjectById,
  updateTicketInProject,
  deleteTicketFromProject,
  addTicketToProject,
  addMemberToProject,
  deleteMemberFromProject,
  getFriends,
} from '../../api';
import { Formik } from 'formik';
import * as Yup from 'yup';
import UploadTicket from './UploadTicket';
import TicketCard from './TicketCard';

function ProjectDetails({ setActiveSection }) {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditTicketModal, setShowEditTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [memberModalError, setMemberModalError] = useState('');

  // Limpiar mensajes después de 15 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 10000);

    return () => clearTimeout(timer);
  }, [errorMessage, successMessage]);

  useEffect(() => {
    if (typeof setActiveSection === 'function') {
      setActiveSection('projectDetails');
    }

    const fetchData = async () => {
      try {
        const [projectData, friendsData] = await Promise.all([
          getProjectById(id),
          getFriends(),
        ]);
        setProject({
          ...projectData,
          members: projectData.members || [],
          tickets: projectData.tickets || [],
        });
        setFriends(friendsData);
      } catch (error) {
        console.error('Error fetching project details or friends:', error);
        setErrorMessage('No se pudo cargar el proyecto. Por favor, inténtelo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setActiveSection]);

  const handleEditTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowEditTicketModal(true);
  };

  const handleUpdateTicket = async (values) => {
    try {
      const updatedTicketData = { ...values };
      const response = await updateTicketInProject(id, values._id, updatedTicketData);
      setProject(response.project);
      setShowEditTicketModal(false);
      setSuccessMessage('Ticket actualizado exitosamente.');
    } catch (error) {
      console.error('Error updating ticket:', error);
      setErrorMessage('Ocurrió un error al actualizar el ticket.');
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      const response = await deleteTicketFromProject(id, ticketId);
      setProject(response.project);
      setSuccessMessage('Ticket eliminado exitosamente.');
    } catch (error) {
      console.error('Error deleting ticket:', error);
      setErrorMessage('Ocurrió un error al eliminar el ticket.');
    }
  };

  const handleUploadTicket = async (ticketData) => {
    try {
      const response = await addTicketToProject(id, ticketData);
      setProject(response.project);
      setSuccessMessage('Ticket añadido exitosamente.');
    } catch (error) {
      console.error('Error adding ticket:', error);
      setErrorMessage('No se pudo agregar el ticket. Por favor, inténtelo más tarde.');
    }
  };

  const handleAddMember = async (values, { resetForm }) => {
    try {
      const memberData = {
        name: values.name,
        userId: values.friendId || null,
        isTemporary: !values.friendId,
      };
      const response = await addMemberToProject(id, memberData);
      setProject(response.project);
      setShowAddMemberModal(false);
      resetForm();
      setSuccessMessage('Miembro añadido exitosamente.');
    } catch (error) {
      console.error('Error adding member:', error);
      setMemberModalError('No se pudo añadir el miembro. Inténtelo más tarde.');
    }
  };

  const handleConfirmDeleteMember = (member) => {
    setMemberToDelete(member);
    setShowConfirmDeleteModal(true);
  };

  const handleDeleteMember = async () => {
    try {
      const response = await deleteMemberFromProject(id, memberToDelete._id);
      setProject(response.project);
      setSuccessMessage('Miembro eliminado exitosamente.');
    } catch (error) {
      console.error('Error deleting member:', error);
      setErrorMessage('No se pudo eliminar el miembro.');
    } finally {
      setShowConfirmDeleteModal(false);
      setMemberToDelete(null);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!project) return <p>{errorMessage || 'Proyecto no encontrado'}</p>;

  return (
    <div className="p-4">
      <h3>{project.name}</h3>
      <p>{project.detail || 'Sin descripción'}</p>

      {errorMessage && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setErrorMessage('')}
        >
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}


      {/* Gestión de Miembros */}
      <h4>Miembros</h4>
      <Button variant="primary" className="mb-3" onClick={() => setShowAddMemberModal(true)}>
        Añadir Miembro
      </Button>
      <ul className="list-group">
        {project.members.map((member) => (
          <li
            key={member._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {member.name}
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleConfirmDeleteMember(member)}
            >
              Eliminar
            </Button>
          </li>
        ))}
      </ul>


      {/* Gestión de Tickets */}
      <h4>Tickets</h4>
      <UploadTicket onUpload={handleUploadTicket} members={project.members} />
      <Row xs={1} md={3} className="g-4 mt-3">
        {project.tickets.map((ticket) => (
          <Col key={ticket._id}>
            <TicketCard
              ticket={ticket}
              onEdit={() => handleEditTicket(ticket)}
              onDelete={() => handleDeleteTicket(ticket._id)}
              members={project.members}
            />
          </Col>
        ))}
      </Row>

      {/* Modal para añadir miembros */}
      <Modal show={showAddMemberModal} onHide={() => setShowAddMemberModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Miembro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {memberModalError && <Alert variant="danger">{memberModalError}</Alert>}
          <Formik
            initialValues={{ friendId: '', name: '' }}
            validationSchema={Yup.object({
              name: Yup.string().when('friendId', {
                is: '',
                then: Yup.string().required('El nombre es obligatorio si no seleccionas un amigo'),
              }),
            })}
            onSubmit={handleAddMember}
          >
            {({ handleSubmit, handleChange, values, errors, touched }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Seleccionar Amigo</Form.Label>
                  <Form.Control as="select" name="friendId" value={values.friendId} onChange={handleChange}>
                    <option value="">-- Seleccionar Amigo --</option>
                    {friends.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Nombre del Miembro</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={touched.name && errors.name}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" className="mt-3">Añadir</Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación para eliminar miembros */}
      <Modal show={showConfirmDeleteModal} onHide={() => setShowConfirmDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Miembro</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que quieres eliminar a "{memberToDelete?.name}"?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDeleteMember}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProjectDetails;
