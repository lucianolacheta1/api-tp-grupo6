// src/components/Dashboard/Dashboard.js
import React, { useState, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import ProjectManager from './ProjectManager';
import ProjectDetails from './ProjectDetails';
import FriendsManager from './FriendsManager';
import ExpensesManager from './ExpensesManager';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [friends, setFriends] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [tickets, setTickets] = useState([]); // Estado para los tickets
  const [selectedProject, setSelectedProject] = useState(null);

  const handleAddProject = useCallback(() => {
    setActiveSection('projects');
  }, []);

  const handleSelectProject = useCallback((projectId) => {
    const project = projects.find((proj) => proj.id === projectId);
    setSelectedProject(project);
    setActiveSection('projectDetails');
  }, [projects]);

  const handleUploadTicketData = useCallback((ticketData) => {
    setTickets((prevTickets) => [...prevTickets, ticketData]);
    if (selectedProject) {
      const updatedProjects = projects.map((project) =>
        project.id === selectedProject.id
          ? { ...project, tickets: [...(project.tickets || []), ticketData] }
          : project
      );
      setProjects(updatedProjects);
    }
  }, [selectedProject, projects]);

  const handleBackToProjects = useCallback(() => {
    setSelectedProject(null);
    setActiveSection('projects');
  }, []);

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Menú lateral izquierdo */}
        <Col xs={12} md={3} lg={2} className="px-0">
          <Sidebar
            onAddProject={handleAddProject}
            setActiveSection={setActiveSection}
          />
        </Col>

        {/* Contenido principal */}
        <Col xs={12} md={9} lg={10} className="pt-4">
          {activeSection === 'projects' && !selectedProject && (
            <ProjectManager
              projects={projects}
              setProjects={setProjects}
              onSelectProject={handleSelectProject}
            />
          )}

          {selectedProject && (
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
            />
          )}
          {activeSection === 'expenses' && (
            <ExpensesManager expenses={expenses} setExpenses={setExpenses} />
          )}
          {activeSection === 'friends' && (
            <FriendsManager friends={friends} setFriends={setFriends} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;