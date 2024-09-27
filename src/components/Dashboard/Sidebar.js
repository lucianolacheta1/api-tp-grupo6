import React from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Sidebar = ({ onAddProject, setActiveSection }) => {
  return (
    <div className="bg-light vh-100 d-flex flex-column justify-content-between">
      <div>
<<<<<<< HEAD
=======
        <div className="d-flex flex-column align-items-start mb-3 px-3 mt-3">
          <Button variant="primary" className="mb-2 w-100" onClick={onAddProject}>
            Añadir Proyecto
          </Button>
        </div>
>>>>>>> b171919793d715b1a39e1b19686746b8c55a2900

        <div className="px-3">
          <h5 className="mt-4">Navegación</h5>
          <ListGroup variant="flush">
            <ListGroup.Item action onClick={() => setActiveSection('projects')}>
              Proyectos
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => setActiveSection('expenses')}>
              Gastos
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => setActiveSection('friends')}>
              Amigos
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => setActiveSection('history')}>
              Historial y Reportes
            </ListGroup.Item>
          </ListGroup>
        </div>
      </div>

      <div className="px-3 mb-3">
        <Button variant="link" onClick={() => setActiveSection('settings')}>
          Configuración
        </Button>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  onAddProject: PropTypes.func.isRequired,
  setActiveSection: PropTypes.func.isRequired,
};

export default React.memo(Sidebar);