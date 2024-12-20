import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import ProjectManager from '../Projects/ProjectManager';
import ProjectDetails from '../Projects/ProjectDetails';
import FriendsManager from './FriendsManager';
import ExpensesManager from './ExpensesManager';
import HistoryReports from './HistoryReports';
import { getFriends, getProjects } from '../../api';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [friends, setFriends] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error al obtener proyectos:', error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (activeSection === 'friends') {
      const fetchFriends = async () => {
        try {
          const friendsData = await getFriends();
          setFriends(friendsData);
        } catch (error) {
          console.error('Error al obtener amigos:', error);
        }
      };
      fetchFriends();
    }
  }, [activeSection]);

  const handleSelectProject = (projectId) => {
    const project = projects.find((proj) => proj._id === projectId);
    setSelectedProject(project);
    setActiveSection('projectDetails');
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setActiveSection('projects');
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col xs={12} className="pt-4">
          <ButtonGroup className="mb-3">
            <Button variant="outline-primary" onClick={() => setActiveSection('projects')}>
              Proyectos
            </Button>
            <Button variant="outline-primary" onClick={() => setActiveSection('friends')}>
              Amigos
            </Button>
            <Button variant="outline-primary" onClick={() => setActiveSection('expenses')}>
              Gastos
            </Button>
            <Button variant="outline-primary" onClick={() => setActiveSection('history')}>
              Historial
            </Button>
          </ButtonGroup>

          {activeSection === 'projects' && !selectedProject && (
            <ProjectManager
              projects={projects}
              setProjects={setProjects}
              onSelectProject={handleSelectProject}
            />
          )}

          {activeSection === 'projectDetails' && selectedProject && (
            <ProjectDetails
              project={selectedProject}
              onBack={handleBackToProjects}
              onUpdateProject={(updatedProject) => {
                const updatedProjects = projects.map((project) =>
                  project._id === updatedProject._id ? updatedProject : project
                );
                setProjects(updatedProjects);
                setSelectedProject(updatedProject);
              }}
              friends={friends}
              setFriends={setFriends}
              setActiveSection={setActiveSection}
            />
          )}

          {activeSection === 'expenses' && (
            <ExpensesManager expenses={expenses} setExpenses={setExpenses} />
          )}

          {activeSection === 'friends' && (
            <FriendsManager friends={friends} setFriends={setFriends} />
          )}

          {activeSection === 'history' && (
            <HistoryReports expenses={expenses} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
