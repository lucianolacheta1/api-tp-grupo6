// src/components/Dashboard/Dashboard.js
import React, { useState, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import ProjectManager from './ProjectManager';
import ProjectDetails from './ProjectDetails';
import FriendsManager from './FriendsManager';
import ExpensesManager from './ExpensesManager';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [friends, setFriends] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleAddProject = useCallback(() => {
    setActiveSection('projects');
  }, []);

  const handleUploadTicket = useCallback(() => {
    setActiveSection('expenses');
  }, []);

  const handleSelectProject = useCallback((projectId) => {
    const project = projects.find((proj) => proj.id === projectId);
    setSelectedProject(project);
  }, [projects]);

  const handleUpdateProject = useCallback((updatedProject) => {
    setProjects((prevProjects) =>
      prevProjects.map((proj) =>
        proj.id === updatedProject.id ? updatedProject : proj
      )
    );
    setSelectedProject(updatedProject);
  }, []);

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Menú lateral izquierdo */}
        <Col xs={12} md={3} lg={2} className="px-0">
          <Sidebar
            onAddProject={handleAddProject}
            onUploadTicket={handleUploadTicket}
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
              onBack={() => setSelectedProject(null)}
              onUpdateProject={handleUpdateProject}
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
}

export default Dashboard;
