import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import {
  getProjectById,
  updateTicketInProject,
  deleteTicketFromProject,
  addTicketToProject,
  addMemberToProject,
  deleteMemberFromProject,
  getFriends,
  updateProject,
} from '../../api';
import { Formik } from 'formik';
import * as Yup from 'yup';
import UploadTicket from './UploadTicket';
import TicketCard from './TicketCard';
import BalanceSummary from './BalanceSummary';

function ProjectDetails({ setActiveSection }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [showEditTicketModal, setShowEditTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showConfirmCloseModal, setShowConfirmCloseModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [memberModalError, setMemberModalError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Limpiar mensajes después de 10 segundos
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

  const handleUploadTicket = async (ticketData) => {
    try {
      const response = await addTicketToProject(id, ticketData);
      console.log('Ticket añadido exitosamente:', response.project);
      setProject((prevProject) => ({
        ...prevProject,
        tickets: [...prevProject.tickets, response.project.tickets[response.project.tickets.length - 1]],
      }));
      setSuccessMessage('Ticket añadido exitosamente.');
      setRefreshKey(refreshKey + 1);
    } catch (error) {
      console.error('Error adding ticket:', error);
      setErrorMessage('No se pudo agregar el ticket. Por favor, inténtelo más tarde.');
    }
  };

  const handleEditTicket = (ticket) => {
    const initialValues = {
      date: ticket.date.split('T')[0],
      paidBy: ticket.paidBy,
      divisionType: ticket.divisionType,
      details: ticket.products.map(p => ({product: p.product, amount: p.amount})),
      divisionMembers: ticket.divisionMembers.map(dm => {
        if (ticket.divisionType === 'porcentual') {
          return { memberId: dm.memberId, percentage: dm.percentage };
        } else {
          return { memberId: dm.memberId };
        }
      }),
    };
    setSelectedTicket({...ticket, initialValues});
    setShowEditTicketModal(true);
  };

  const handleUpdateTicket = async (values) => {
    try {
      const updatedTicketData = { ...values };
      const response = await updateTicketInProject(id, selectedTicket._id, updatedTicketData);
      setProject(response.project);
      setShowEditTicketModal(false);
      setSuccessMessage('Ticket actualizado exitosamente.');
      setRefreshKey(refreshKey + 1);
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
      setRefreshKey(refreshKey + 1);
    } catch (error) {
      console.error('Error deleting ticket:', error);
      setErrorMessage('Ocurrió un error al eliminar el ticket.');
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

  const handleCloseProject = async () => {
    try {
      const updated = await updateProject(id, { status: "Finalizado" });
      setProject(updated); 
      setShowConfirmCloseModal(false);
      setSuccessMessage("Proyecto cerrado exitosamente.");
    } catch (error) {
      console.error("Error al cerrar el proyecto:", error);
      setErrorMessage("No se pudo cerrar el proyecto.");
    }
  };

  const handleConfirmCloseClick = () => {
    setShowConfirmCloseModal(true);
  };

  if (loading) return <p>Cargando...</p>;
  if (!project) return <p>{errorMessage || 'Proyecto no encontrado'}</p>;

  return (
    <div className="p-4">
      <Button variant="secondary" onClick={() => navigate('/projects')} className="mb-3">
        Volver a la Lista de Proyectos
      </Button>
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
      <Button variant="primary" onClick={() => setShowCreateTicketModal(true)} className="mb-3">
        Cargar mi Ticket
      </Button>
      <Row xs={1} md={3} className="g-4 mt-3">
        {project.tickets.map((ticket) => (
          <Col key={ticket._id}>
            <TicketCard
              ticket={ticket}
              onEdit={handleEditTicket}
              onDelete={() => handleDeleteTicket(ticket._id)}
              members={project.members}
            />
          </Col>
        ))}
      </Row>

      <BalanceSummary projectId={id} refreshKey={refreshKey} />

      {project.status === "En progreso" && (
        <div className="text-center mt-4">
          <Button variant="warning" onClick={handleConfirmCloseClick}>Cerrar Proyecto</Button>
        </div>
      )}

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
                <Form.Group className="mt-3">
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

      {/* Modal crear ticket */}
      <UploadTicket
        mode="create"
        onUpload={handleUploadTicket}
        members={project.members}
        show={showCreateTicketModal}
        onHide={() => setShowCreateTicketModal(false)}
      />

      {/* Modal editar ticket */}
      {selectedTicket && (
        <UploadTicket
          mode="edit"
          initialValues={selectedTicket.initialValues}
          onUpdate={handleUpdateTicket}
          members={project.members}
          show={showEditTicketModal}
          onHide={() => setShowEditTicketModal(false)}
        />
      )}

      {/* Modal de confirmación para cerrar proyecto */}
      <Modal show={showConfirmCloseModal} onHide={() => setShowConfirmCloseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cierre de Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres cerrar el proyecto <strong>{project?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmCloseModal(false)}>
            Cancelar
          </Button>
          <Button variant="warning" onClick={handleCloseProject}>
            Cerrar Proyecto
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProjectDetails;
