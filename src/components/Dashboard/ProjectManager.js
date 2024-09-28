import React, { useState, useCallback } from 'react';
import { ListGroup, Button, Modal, Form, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

function ProjectManager({ projects, setProjects, onSelectProject, onDeleteProject }) {
  const [showModal, setShowModal] = useState(false);

  const handleCreateProject = useCallback(
    (values, { resetForm }) => {
      const newProject = {
        id: Date.now(),
        name: values.projectName,
        description: values.projectDescription,
        members: [],
        expenses: [],
      };
      setProjects((prevProjects) => [...prevProjects, newProject]);
      resetForm();
      setShowModal(false);
    },
    [setProjects]
  );

  const validationSchema = Yup.object().shape({
    projectName: Yup.string().required('El nombre del proyecto es obligatorio'),
    projectDescription: Yup.string(),
  });

  return (
    <div>
      <h3>Mis Proyectos</h3>
      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
        Crear Proyecto
      </Button>
      {projects.length === 0 ? (
        <p>No tienes proyectos aún. Puedes crear uno nuevo.</p>
      ) : (
        <ListGroup>
          {projects.map((project) => (
            <Card key={project.id} className="mb-3 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title>{project.name}</Card.Title>
                    <Card.Text>{project.description}</Card.Text>
                  </div>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onSelectProject(project.id)}
                      className="mr-2"
                    >
                      Ver Detalles
                    </Button>
                    {' '} {/* Añadir espacio entre los botones */}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDeleteProject(project.id)}
                      className="ml-2"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
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
                    isInvalid={touched.projectDescription && errors.projectDescription}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.projectDescription}
                  </Form.Control.Feedback>
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
  projects: PropTypes.array.isRequired,
  setProjects: PropTypes.func.isRequired,
  onSelectProject: PropTypes.func.isRequired,
  onDeleteProject: PropTypes.func.isRequired,
};

export default React.memo(ProjectManager);