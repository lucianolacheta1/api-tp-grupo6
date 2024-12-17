import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-light vh-100 d-flex flex-column justify-content-between">
      <div>
        <div className="px-3">
          <h5 className="mt-4">Navegación</h5>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Link to="/projects" className="text-decoration-none text-dark">
                Proyectos
              </Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Link to="/friends" className="text-decoration-none text-dark">
                Amigos
              </Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Link to="/history" className="text-decoration-none text-dark">
                Historial
              </Link>
            </ListGroup.Item>
          </ListGroup>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Sidebar);
