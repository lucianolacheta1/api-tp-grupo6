// src/components/Dashboard/TicketCard.js
import React from 'react';
import { Card, ListGroup, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

const TicketCard = ({ ticket }) => {
  return (
    <Col xs={12} md={6} className="d-flex justify-content-center p-2">
      <Card className="bg-white shadow-lg rounded-lg p-3 flex flex-col md:flex-row w-full max-w-md">
        <div className="flex justify-center mb-4 md:mb-0 md:w-1/2">
          <Card.Img
            variant="top"
            src={URL.createObjectURL(ticket.file)}
            style={{ maxHeight: '200px', objectFit: 'cover' }}
            className="w-full h-auto"
          />
        </div>
        <Card.Body className="md:w-1/2 flex flex-col justify-between">
          <Card.Title className='text-center md:text-left'>Detalles del Ticket</Card.Title>
          <ListGroup variant="flush" className='text-center md:text-left'>
            {ticket.details.map((detail, index) => (
              <ListGroup.Item key={index}>
                <strong>Producto:</strong> {detail.product} <br />
                <strong>Monto:</strong> ${detail.amount}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Col>
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