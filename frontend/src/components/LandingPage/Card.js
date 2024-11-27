import React from "react";
import styled from "styled-components";

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <ZoomImage
          src="/assets/Captura-prueba.jpg"
          alt="Gastos Compartidos"
          className="img-fluid"
        />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;  // Ajusta el contenedor para que tome el 100% del alto de la pantalla

  .card {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;  // Reducir el ancho al 80% del contenedor
    max-width: 800px;  // Establecer un ancho máximo para la tarjeta
    height: auto;
    padding: 20px;
    border-radius: 20px;
    background: #e0e0e0;
    box-shadow: 10px 10px 30px #bebebe, -10px -10px 30px #ffffff;
  }
`;

const ZoomImage = styled.img`
  width: 100%;  // Se ajusta al 100% del ancho disponible
  height: auto;  // Mantiene la proporción de la imagen
  border-radius: 20px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.03, 1.03); // Efecto de zoom al hacer hover
  }
`;

export default Card;