import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

const BalanceSummary = ({ projectId }) => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/balances`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('No se pudo cargar los balances');
        }

        const data = await response.json();
        setBalances(data);
      } catch (err) {
        console.error('Error fetching balances:', err);
        setError('Error al cargar los balances. Inténtelo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [projectId]);

  if (loading) {
    return <p>Cargando balances...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="mt-4">
      <h4>Resumen de Balances</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Miembro</th>
            <th>Debe a</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((balance, index) => (
            <tr key={index}>
            <td>{typeof balance.from === 'object' ? balance.from.name : balance.from}</td>
            <td>{typeof balance.to === 'object' ? balance.to.name : balance.to}</td>
            <td>${balance.amount}</td>

            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

BalanceSummary.propTypes = {
  projectId: PropTypes.string.isRequired,
};

export default BalanceSummary;
