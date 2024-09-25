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
  height: 30rem;  

  .card {
 width: 790px;
 height: 454px;
 display: flex;
 justify-content: center;
 align-items: center;
 border-radius: 50px;
 background: #e0e0e0;
 box-shadow: 20px 20px 60px #bebebe,
               -20px -20px 60px #ffffff;
}
`;

const ZoomImage = styled.img`
  max-height: 452px;
  max-width: 785px;
  border-radius: 55px;
  object-fit: cover;
  padding: 15px;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.03, 1.08); // Efecto de zoom al hacer hover
  }
`;

export default Card;
