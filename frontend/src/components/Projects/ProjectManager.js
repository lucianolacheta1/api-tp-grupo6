// src/components/Projects/ProjectManager.js
import React, { useState, useCallback, useEffect } from 'react';
import { Button, Modal, Form, ListGroup, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createProject, getProjects, deleteProject } from '../../api';
import { useNavigate } from 'react-router-dom';

function ProjectManager({ onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Obtener proyectos al montar el componente
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setErrorMessage('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
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

      const newProject = {
        name: values.projectName,
        detail: values.projectDescription || 'Sin descripción',
        members: [],
        totalExpense: 0,
        status: 'En progreso',
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
    [projects, navigate]
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
  });

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
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewDetails(project._id)}
                        className="mr-2"
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteProject(project._id)}
                        className="ml-2"
                      >
                        Eliminar
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
            initialValues={{ projectName: '', projectDescription: '' }}
            validationSchema={validationSchema}
            onSubmit={handleCreateProject}
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
                <Form.Group controlId="projectName">
                  <Form.Label>Nombre del Proyecto</Form.Label>
                  <Form.Control
                    type="text"
                    name="projectName"
                    placeholder="Ingresa el nombre del proyecto"
                    value={values.projectName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.projectName && errors.projectName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.projectName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="projectDescription">
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
                <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
                  {isSubmitting ? 'Creando...' : 'Crear'}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}

ProjectManager.propTypes = {
  onSelectProject: PropTypes.func.isRequired,
};

export default React.memo(ProjectManager);