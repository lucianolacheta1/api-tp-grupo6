import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';

function TicketCard({ ticket, onEdit, onDelete, members }) {
  const payerMember = members.find((member) => member.name === ticket.paidBy);
  const payer = payerMember ? payerMember.name : 'Desconocido';
  
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Detalles del Ticket</Card.Title>
        <Card.Text>
          <strong>Fecha:</strong> {new Date(ticket.date).toLocaleDateString()}
        </Card.Text>
        <Card.Text>
          <strong>Pagado por:</strong> {payer}
        </Card.Text>
        <Card.Text>
          <strong>Productos:</strong>
        </Card.Text>
        <ul>
          {ticket.products.map((product, index) => (
            <li key={index}>
              {product.product} - {product.amount}
            </li>
          ))}
        </ul>
        {onEdit && (
          <Button variant="secondary" onClick={() => onEdit(ticket)} className="mr-2">
            Editar Ticket
          </Button>
        )}
        <Button variant="danger" onClick={() => onDelete(ticket._id)}>
          Eliminar Ticket
        </Button>
      </Card.Body>
    </Card>
  );
}

TicketCard.propTypes = {
  ticket: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    paidBy: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        product: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
      })
    ).isRequired,
    divisionType: PropTypes.string.isRequired,
    divisionMembers: PropTypes.array.isRequired,
  }).isRequired,
  onEdit: PropTypes.func,  // ya no es required
  onDelete: PropTypes.func.isRequired,
  members: PropTypes.array.isRequired,
};

export default TicketCard;
