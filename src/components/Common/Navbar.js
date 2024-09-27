// src/components/Navbar.js
import React, { useContext } from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll'; // Importar react-scroll
import { AuthContext } from '../../AuthContext';
import PropTypes from 'prop-types';

function NavigationBar({ openLoginModal }) {
  const { authenticatedUser, logout } = useContext(AuthContext);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          FairSplit
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {authenticatedUser ? (
              <>
                {/* Botón "Inicio" que lleva al dashboard */}
                <Nav.Link as={Link} to="/dashboard">
                  Inicio
                </Nav.Link>

                {/* Menú desplegable con opciones de usuario */}
                <NavDropdown
                  title={authenticatedUser.username}
                  id="basic-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    Mi cuenta
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>
                    Cerrar sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
<<<<<<< HEAD
=======
                <ScrollLink to="whyChooseUs" smooth={true} duration={100} className="nav-link" href="#">
                  Características
                </ScrollLink>
>>>>>>> b171919793d715b1a39e1b19686746b8c55a2900
                <Button variant="primary" onClick={() => openLoginModal('login')}>
                  Iniciar sesión
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

NavigationBar.propTypes = {
  openLoginModal: PropTypes.func.isRequired,
};

export default React.memo(NavigationBar);