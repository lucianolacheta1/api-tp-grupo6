import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProjectManager from '../Projects/ProjectManager';
import ProjectDetails from '../Projects/ProjectDetails';
import FriendsManager from './FriendsManager';
import ExpensesManager from './ExpensesManager';
import HistoryReports from './HistoryReports';
import { getFriends } from '../../api';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [friends, setFriends] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

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
    const project = projects.find((proj) => proj.id === projectId);
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
        {/* Contenido principal ocupando todo el ancho (asumiendo que el Sidebar está en el layout) */}
        <Col xs={12} className="pt-4">
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
                  project.id === updatedProject.id ? updatedProject : project
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
