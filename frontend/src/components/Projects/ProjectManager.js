import React, { useState, useCallback, useEffect } from 'react';
import { Button, Modal, Form, ListGroup, Card, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { createProject, getProjects, deleteProject, getFriends, updateProject } from '../../api';
import { useNavigate } from 'react-router-dom';

function ProjectManager({ onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [friends, setFriends] = useState([]); // Para almacenar la lista de amigos
  const [showModal, setShowModal] = useState(false);
  const [showConfirmCloseModal, setShowConfirmCloseModal] = useState(false);
  const [projectToClose, setProjectToClose] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Obtener proyectos al montar el componente
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await getProjects();
        const enProgreso = data.filter(proj => proj.status === "En progreso");
        setProjects(enProgreso);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setErrorMessage('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Obtener amigos del usuario autenticado
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await getFriends();
        setFriends(data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
    fetchFriends();
  }, []);

  const handleCreateProject = useCallback(
    async (values, { resetForm }) => {
      const projectExists = projects.some(
        (project) => project.name.toLowerCase() === values.projectName.toLowerCase()
      );

      if (projectExists) {
        setErrorMessage('Ya existe un proyecto con este nombre. Intenta otro nombre.');
        return;
      }

      // Crear array de miembros a partir del FieldArray
      const members = values.members.map((m) => {
        if (m.friendId && m.friendId !== '') {
          // Seleccionó un amigo existente
          const friendSelected = friends.find((f) => f._id === m.friendId);
          return {
            name: friendSelected.name,
            userId: friendSelected.userId || null,
            isTemporary: false,
          };
        } else {
          // Miembro temporal ingresado manualmente
          return {
            name: m.name,
            userId: null,
            isTemporary: true,
          };
        }
      });

      const newProject = {
        name: values.projectName,
        detail: values.projectDescription || 'Sin descripción',
        status: 'En progreso',
        members,
      };

      try {
        setLoading(true);
        const createdProject = await createProject(newProject);
        setProjects((prevProjects) => [...prevProjects, createdProject]);
        resetForm();
        setShowModal(false);
        // Navegar a la página de detalles del nuevo proyecto
        navigate(`/projects/${createdProject._id}`);
      } catch (error) {
        console.error('Error al crear el proyecto:', error);
        setErrorMessage('Failed to create a project. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [projects, navigate, friends]
  );

  const handleDeleteProject = async (projectId) => {
    try {
      setLoading(true);
      await deleteProject(projectId);
      setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
      setErrorMessage('Failed to delete the project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const validationSchema = Yup.object().shape({
    projectName: Yup.string().required('El nombre del proyecto es obligatorio'),
    projectDescription: Yup.string().notRequired(),
    members: Yup.array().of(
      Yup.object().shape({
        friendId: Yup.string().notRequired(),
        // Cambio realizado aquí: uso de la función callback en `when`
        name: Yup.string().when('friendId', (friendId, schema) => {
          if (!friendId || friendId === '') {
            return schema.required('Debes ingresar un nombre si no seleccionas un amigo');
          }
          return schema;
        }),
      })
    ).min(1, 'Debes agregar al menos un miembro'),
  });

  const handleCloseProject = async () => {
    if (!projectToClose) return;
    try {
      const updated = await updateProject(projectToClose._id, { status: "Finalizado" });
      // Actualizar la lista filtrando otra vez
      const data = await getProjects();
      const enProgreso = data.filter(proj => proj.status === "En progreso");
      setProjects(enProgreso);
      setShowConfirmCloseModal(false);
      setProjectToClose(null);
    } catch (error) {
      console.error("Error al cerrar el proyecto:", error);
    }
  };

  const handleConfirmCloseClick = (project) => {
    setProjectToClose(project);
    setShowConfirmCloseModal(true);
  };

  return (
    <div>
      <h3>Mis Proyectos</h3>
      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
        Crear Proyecto
      </Button>
      {loading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      ) : (
        <ListGroup>
          {projects.length === 0 ? (
            <p>No tienes proyectos aún. Puedes crear uno nuevo.</p>
          ) : (
            projects.map((project) => (
              <Card key={project._id} className="mb-3 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Card.Title>{project.name}</Card.Title>
                      <Card.Text>{project.detail}</Card.Text>
                    </div>
                    <div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleViewDetails(project._id)}
                        className="me-2"
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteProject(project._id)}
                        className="me-2"
                      >
                        Eliminar
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleConfirmCloseClick(project)}
                      >
                        Cerrar Proyecto
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </ListGroup>
      )}

      {/* Modal para crear proyectos */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ projectName: '', projectDescription: '', members: [{ name: '', friendId: '' }] }}
            validationSchema={validationSchema}
            onSubmit={handleCreateProject}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="projectName">
                  <Form.Label>Nombre del Proyecto</Form.Label>
                  <Form.Control
                    type="text"
                    name="projectName"
                    placeholder="Ingresa el nombre del proyecto"
                    value={values.projectName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.projectName && !!errors.projectName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.projectName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="projectDescription" className="mt-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="projectDescription"
                    placeholder="Ingresa una descripción"
                    value={values.projectDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Group>

                <Form.Label className="mt-3">Miembros del Proyecto</Form.Label>
                <FieldArray name="members">
                  {({ push, remove }) => (
                    <div>
                      {values.members.map((member, index) => {
                        const memberNameError = errors.members && errors.members[index] && errors.members[index].name;
                        return (
                          <div key={index} className="mb-3 p-2 border rounded">
                            <Row>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Seleccionar Amigo (opcional)</Form.Label>
                                  <Form.Control
                                    as="select"
                                    name={`members[${index}].friendId`}
                                    value={member.friendId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  >
                                    <option value="">-- Ningún amigo seleccionado --</option>
                                    {friends.map((f) => (
                                      <option key={f._id} value={f._id}>
                                        {f.name} ({f.email})
                                      </option>
                                    ))}
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Nombre del Miembro (si no se selecciona amigo)</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name={`members[${index}].name`}
                                    placeholder="Ingresa el nombre del miembro"
                                    value={member.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.members && touched.members[index] && !!memberNameError}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {memberNameError}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                            </Row>
                            {values.members.length > 1 && (
                              <Button variant="danger" size="sm" onClick={() => remove(index)}>
                                Eliminar Miembro
                              </Button>
                            )}
                          </div>
                        );
                      })}
                      <Button variant="secondary" size="sm" onClick={() => push({ name: '', friendId: '' })}>
                        Añadir otro miembro
                      </Button>
                    </div>
                  )}
                </FieldArray>

                <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
                  {isSubmitting ? 'Creando...' : 'Crear'}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación para cerrar proyecto */}
      <Modal show={showConfirmCloseModal} onHide={() => setShowConfirmCloseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cierre de Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres cerrar el proyecto <strong>{projectToClose?.name}</strong>?
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

ProjectManager.propTypes = {
  onSelectProject: PropTypes.func.isRequired,
};

export default React.memo(ProjectManager);
