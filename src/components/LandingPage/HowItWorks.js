// src/components/HowItWorks.js
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

function HowItWorks({ openLoginModal }) {
  return (
    <section className="my-5">
      <Container>
        <h2 className="text-center mb-4" data-aos="fade-up">
          ¿Cómo Funciona?
        </h2>
        <Row className="align-items-center mb-5">
          <Col md={6} data-aos="fade-right">
            <img
              src="/assets/tickets-image.png"
              alt="Sube tus Tickets"
              className="img-fluid mb-3"
            />
          </Col>
          <Col md={6} data-aos="fade-left">
            <h3>Sube tus Tickets</h3>
            <p>
              Captura una imagen de tus tickets de compra o ingresa los detalles manualmente.
              Nuestra aplicación te permite registrar la fecha, el monto total, y una descripción de cada gasto.
            </p>
            <Button variant="outline-dark" onClick={() => openLoginModal('register')}>
              Cargar mi Ticket
            </Button>
          </Col>
        </Row>

        <Row className="align-items-center">
          <Col md={6} data-aos="fade-right" className="order-md-2">
            <img
              src="/assets/divide-image.png"
              alt="Divide y Calcula"
              className="img-fluid mb-3"
            />
          </Col>
          <Col md={6} data-aos="fade-left" className="order-md-1">
            <h3>Divide y Calcula</h3>
            <p>
              Divide los gastos entre los miembros del grupo de forma equitativa o personaliza la división según las necesidades.
            </p>
            <Button variant="outline-dark" onClick={() => openLoginModal('register')}>
              Registrarme
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default HowItWorks;
