import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

const HistoryReports = ({ expenses }) => {
  if (!expenses || expenses.length === 0) {
    return <p>No hay registros disponibles para mostrar.</p>;
  }

  return (
    <div>
      <h4>Historial de Gastos</h4>
      {expenses.map((expense, index) => (
        <Card key={index} className="mb-3 shadow-sm">
          <Card.Body>
            <Card.Title>{expense.description}</Card.Title>
            <Card.Text>
              <strong>Monto:</strong> {expense.amount} <br />
              <strong>Fecha:</strong> {expense.date}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

HistoryReports.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    })
  ),
};

export default HistoryReports;
