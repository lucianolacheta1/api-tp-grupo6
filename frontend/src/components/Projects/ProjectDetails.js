import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { getProjectById, updateTicketInProject, deleteTicketFromProject, addTicketToProject } from '../../api';
import Sidebar from '../Dashboard/Sidebar';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import UploadTicket from './UploadTicket';
import TicketCard from './TicketCard';

function ProjectDetails({ setActiveSection }) {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showEditTicketModal, setShowEditTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    setActiveSection('projectDetails');
    const fetchProject = async () => {
      try {
        const data = await getProjectById(id);
        if (data.members) {
          setProject(data);
        } else {
          setProject({ ...data, members: [] });
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        setErrorMessage('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, setActiveSection]);

  const handleEditTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowEditTicketModal(true);
  };

  const handleUpdateTicket = async (values) => {
    try {
      const updatedTicketData = { ...values };
      const response = await updateTicketInProject(id, values._id, updatedTicketData);
      // Actualizar state local con la respuesta del servidor
      setProject(response.project);
      setShowEditTicketModal(false);
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      const response = await deleteTicketFromProject(id, ticketId);
      setProject(response.project);
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  const handleUploadTicket = async (ticketData) => {
    try {
      const response = await addTicketToProject(id, ticketData);
      // Actualizar el proyecto con la respuesta del servidor
      setProject(response.project);
    } catch (error) {
      console.error('Error adding ticket:', error);
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
        {/* Pasar los miembros al componente UploadTicket */}
        <UploadTicket onUpload={handleUploadTicket} members={project.members || []} />
        {project.tickets && project.tickets.length > 0 ? (
          <Row xs={1} md={3} className="g-4">
            {project.tickets.map((ticket) => (
              <Col key={ticket._id}>
                <TicketCard
                  ticket={ticket}
                  onEdit={() => handleEditTicket(ticket)}
                  onDelete={() => handleDeleteTicket(ticket._id)}
                  members={project.members || []}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <p>No hay tickets cargados.</p>
        )}

        {/* Modal para editar un ticket */}
        {selectedTicket && (
          <Modal show={showEditTicketModal} onHide={() => setShowEditTicketModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Editar Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Formik
                initialValues={{
                  ...selectedTicket,
                  products: selectedTicket.products || [{ product: '', amount: '' }],
                  paidBy: selectedTicket.paidBy || '',
                }}
                validationSchema={Yup.object({
                  date: Yup.string().required('La fecha es obligatoria'),
                  paidBy: Yup.string().required('Debe seleccionar quién pagó el ticket'),
                  products: Yup.array().of(
                    Yup.object({
                      product: Yup.string().required('El nombre del producto es obligatorio'),
                      amount: Yup.number().required('El monto del producto es obligatorio'),
                    })
                  ),
                })}
                onSubmit={handleUpdateTicket}
              >
                {({ values, handleChange, handleSubmit, errors, touched }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="date">
                      <Form.Label>Fecha del Ticket</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={values.date}
                        onChange={handleChange}
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
                        {project.members && project.members.length > 0 ? (
                          project.members.map((member) => (
                            <option key={member.userId} value={member.userId}>
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

                    <FieldArray
                      name="products"
                      render={(arrayHelpers) => (
                        <div>
                          {values.products.map((product, index) => (
                            <div key={index} className="d-flex mb-2">
                              <Form.Control
                                type="text"
                                name={`products[${index}].product`}
                                value={product.product}
                                onChange={handleChange}
                                placeholder="Nombre del producto"
                                isInvalid={
                                  touched.products?.[index]?.product && !!errors.products?.[index]?.product
                                }
                              />
                              <Form.Control
                                type="number"
                                name={`products[${index}].amount`}
                                value={product.amount}
                                onChange={handleChange}
                                placeholder="Monto del producto"
                                className="ml-2"
                                isInvalid={
                                  touched.products?.[index]?.amount && !!errors.products?.[index]?.amount
                                }
                              />
                              <Button
                                variant="danger"
                                onClick={() => arrayHelpers.remove(index)}
                                className="ml-2"
                              >
                                Eliminar
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="secondary"
                            onClick={() => arrayHelpers.push({ product: '', amount: '' })}
                            className="mt-2"
                          >
                            Añadir Producto
                          </Button>
                        </div>
                      )}
                    />
                    <Button variant="primary" type="submit" className="mt-3">
                      Guardar Cambios
                    </Button>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;
