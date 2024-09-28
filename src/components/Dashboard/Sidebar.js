import React from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Sidebar = ({ onAddProject, setActiveSection }) => {
  return (
    <div className="bg-light vh-100 d-flex flex-column justify-content-between">
      <div>

        <div className="px-3">
          <h5 className="mt-4">Navegación</h5>
          <ListGroup variant="flush">
            <ListGroup.Item action onClick={() => setActiveSection('projects')}>
              Proyectos
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
    </div>
  );
};

Sidebar.propTypes = {
  onAddProject: PropTypes.func.isRequired,
  setActiveSection: PropTypes.func.isRequired,
};

export default React.memo(Sidebar);