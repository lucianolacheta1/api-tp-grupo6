import React, { useState, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import ProjectManager from './ProjectManager';
import ProjectDetails from './ProjectDetails';
import FriendsManager from './FriendsManager';
import ExpensesManager from './ExpensesManager';
import HistoryReports from './HistoryReports';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [friends, setFriends] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleAddProject = useCallback(() => {
    setActiveSection('projects');
  }, []);

  const handleSelectProject = useCallback(
    (projectId) => {
      const project = projects.find((proj) => proj.id === projectId);
      setSelectedProject(project);
      setActiveSection('projectDetails');
    },
    [projects]
  );

  const handleUploadTicketData = useCallback(
    (ticketData) => {
      if (selectedProject) {
        const updatedProjects = projects.map((project) =>
          project.id === selectedProject.id
            ? { ...project, tickets: [...(project.tickets || []), ticketData] }
            : project
        );
        setProjects(updatedProjects);
        setSelectedProject((prevSelectedProject) => ({
          ...prevSelectedProject,
          tickets: [...(prevSelectedProject.tickets || []), ticketData],
        }));
      }
    },
    [selectedProject, projects]
  );

  const handleDeleteProject = useCallback(
    (projectId) => {
      const updatedProjects = projects.filter((project) => project.id !== projectId);
      setProjects(updatedProjects);
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(null);
        setActiveSection('projects');
      }
    },
    [projects, selectedProject]
  );

  const handleBackToProjects = useCallback(() => {
    setSelectedProject(null);
    setActiveSection('projects');
  }, []);

  // Consolidar todos los tickets de todos los proyectos
  const allTickets = projects.flatMap((project) => project.tickets || []);

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
              onDeleteProject={handleDeleteProject}
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
              onUploadTicketData={handleUploadTicketData}
              tickets={selectedProject.tickets || []}
            />
          )}
          {activeSection === 'expenses' && (
            <ExpensesManager expenses={expenses} setExpenses={setExpenses} />
          )}
          {activeSection === 'friends' && (
            <FriendsManager friends={friends} setFriends={setFriends} />
          )}
          {activeSection === 'history' && (
            <HistoryReports tickets={allTickets} expenses={expenses} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
