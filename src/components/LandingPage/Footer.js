// src/components/Footer.js
import React from 'react';
import { Container, Button } from 'react-bootstrap';

function Footer({ openLoginModal }) {
  return (
    <footer className="text-center my-5">
      <Container>
        <p className="lead" data-aos="fade-up">
          ¡Empieza Ahora Mismo!
        </p>
        <Button
          variant="primary"
          size="lg"
          className="mt-3"
          onClick={() => openLoginModal('register')}
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Regístrate
        </Button>
        <p className="mt-3" data-aos="fade-up" data-aos-delay="400">
          &copy; FairSplit, 2024
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
