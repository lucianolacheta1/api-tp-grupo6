import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

const HistoryReports = ({ tickets, expenses }) => {
  return (
    <div>
      <h3>Historial y Reportes</h3>
      
      <h4>Tickets</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Monto</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.description}</td>
              <td>{ticket.amount}</td>
              <td>{ticket.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4>Gastos</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id}>
              <td>{expense.id}</td>
              <td>{expense.description}</td>
              <td>{expense.amount}</td>
              <td>{expense.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

HistoryReports.propTypes = {
  tickets: PropTypes.array.isRequired,
  expenses: PropTypes.array.isRequired,
};

export default HistoryReports;