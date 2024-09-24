// src/components/Dashboard/TicketCard.js
import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

const TicketCard = ({ ticket }) => {
  return (
    <div className="w-auto sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
      <Card className="bg-white shadow-lg rounded-lg p-3 w-auto">
        <Card.Img 
          variant="top" 
          src={URL.createObjectURL(ticket.file)} 
          style={{ maxHeight: '200px', maxWidth:'200px', objectFit: 'cover' }} 
        />
        <Card.Body>
          <Card.Title>Detalles del Ticket</Card.Title>
          <ListGroup variant="flush">
            {ticket.details.map((detail, index) => (
              <ListGroup.Item key={index}>
                <strong>Producto:</strong> {detail.product} <br />
                <strong>Monto:</strong> ${detail.amount}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

TicketCard.propTypes = {
  ticket: PropTypes.shape({
    file: PropTypes.object.isRequired,
    details: PropTypes.arrayOf(
      PropTypes.shape({
        product: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default TicketCard;