import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import { getProjects, updateProject } from '../../api'; // Import the API functions
import { useNavigate } from 'react-router-dom';

const HistoryReports = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        const finalizados = data.filter(proj => proj.status === "Finalizado");
        setProjects(finalizados);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleReopenProject = async (projectId) => {
    try {
      await updateProject(projectId, { status: "En progreso" });
      setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
    } catch (error) {
      console.error('Error reopening project:', error);
      setError('Failed to reopen the project. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (projects.length === 0) {
    return <p>No hay registros disponibles para mostrar.</p>;
  }

  return (
    <div>
      <h4>Historial de Proyectos</h4>
      {projects.map((project) => (
        <Card key={project._id} className="mb-3 shadow-sm">
          <Card.Body>
            <Card.Title>{project.name}</Card.Title>
            <Card.Text>
              <strong>Descripción:</strong> {project.detail || 'Sin descripción'} <br />
              <strong>Estado:</strong> {project.status} <br />
              <strong>Miembros:</strong> {project.members.map(member => member.name).join(', ')}
            </Card.Text>
            <Card.Text>
              <strong>Gastos por Miembro:</strong>
              <ul>
                {project.members.map(member => (
                  <li key={member._id}>
                    {member.name}: {project.tickets.reduce((total, ticket) => {
                      return total + ticket.products.reduce((sum, product) => {
                        return sum + (ticket.paidBy === member.name ? product.amount : 0);
                      }, 0);
                    }, 0)}
                  </li>
                ))}
              </ul>
            </Card.Text>
            <Button variant="primary" onClick={() => navigate(`/projects/${project._id}`)}>
              Ver Detalles
            </Button>
            <Button variant="warning" onClick={() => handleReopenProject(project._id)} className="ms-2">
              Reabrir Proyecto
            </Button>
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
