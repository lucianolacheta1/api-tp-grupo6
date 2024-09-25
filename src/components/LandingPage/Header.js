// src/components/Header.js
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import Card from './Card';

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
        <Card />
        <h4 className="p-4 text-2xl leading-relaxed" data-aos="fade-up" data-aos-delay="700">
          Sube tus tickets de compra,<br /> 
          divídelos entre tus amigos,<br/> 
          y mantén un control claro de cuánto debe cada uno.
        </h4>
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
