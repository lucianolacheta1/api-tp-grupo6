// src/components/Header.js
import React from 'react';
import { Container, Button } from 'react-bootstrap';

function Header({ openLoginModal }) {
  return (
    <header className="text-center my-5">
      <Container>
        <h1 className="display-1" data-aos="fade-up">
          SplitWise.
        </h1>
        <p className="lead" data-aos="fade-up" data-aos-delay="200">
          ¡Gestiona tus gastos compartidos de manera fácil y rápida!
        </p>
        <img
          src="/assets/header-image.jpg"
          alt="Gastos Compartidos"
          className="img-fluid mb-3 w-100"
          data-aos="fade-up"
          data-aos-delay="400"
        />
        <Button
          variant="primary"
          size="lg"
          className="mt-4"
          onClick={() => openLoginModal('register')}
          data-aos="fade-up"
          data-aos-delay="600"
        >
          Comienza Ahora
        </Button>
      </Container>
    </header>
  );
}

export default Header;
