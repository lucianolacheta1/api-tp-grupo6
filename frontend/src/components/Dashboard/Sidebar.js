import React from 'react';
import { ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Sidebar = ({ setActiveSection }) => {
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
              Historial
            </ListGroup.Item>
          </ListGroup>
        </div>
      </div>
    </div>
  );
};


Sidebar.propTypes = {
  setActiveSection: PropTypes.func.isRequired,
};

export default React.memo(Sidebar);
