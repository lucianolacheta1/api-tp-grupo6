// src/components/ExpensesManager.js
import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ExpensesManager({ expenses, setExpenses }) {
  return (
    <div>
      <h3>Mis Gastos</h3>
      {expenses.length === 0 ? (
        <p>No tienes gastos registrados.</p>
      ) : (
        <ListGroup>
          {expenses.map((expense) => (
            <ListGroup.Item key={expense.id}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{expense.title}</h5>
                  <p>
                    {expense.amount} - {expense.date}
                  </p>
                </div>
                <Button variant="outline-primary" size="sm">
                  Ver Detalles
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

ExpensesManager.propTypes = {
  expenses: PropTypes.array.isRequired,
  setExpenses: PropTypes.func.isRequired,
};

export default React.memo(ExpensesManager);
