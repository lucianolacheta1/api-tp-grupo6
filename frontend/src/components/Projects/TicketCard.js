// src/components/Projects/TicketCard.js
import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

function TicketCard({ ticket }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Detalles del Ticket</Card.Title>
        <Card.Text>
          <strong>Fecha:</strong> {ticket.date}
        </Card.Text>
        <Card.Text>
          <strong>Productos:</strong>
        </Card.Text>
        <ul>
          {ticket.details.map((detail, index) => (
            <li key={index}>
              {detail.product} - {detail.amount}
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
}

TicketCard.propTypes = {
  ticket: PropTypes.shape({
    date: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(
      PropTypes.shape({
        product: PropTypes.string.isRequired,
        amount: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default TicketCard;
