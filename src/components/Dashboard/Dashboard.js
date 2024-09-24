// src/components/Dashboard/Dashboard.js
import React, { useState, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import ProjectManager from './ProjectManager';
import ProjectDetails from './ProjectDetails';
import FriendsManager from './FriendsManager';
import ExpensesManager from './ExpensesManager';
import UploadTicket from './UploadTicket';
import TicketCard from './TicketCard'; // Importar el nuevo componente

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

  const handleUploadTicket = useCallback(() => {
    setActiveSection('uploadTicket');
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

  const handleUpload = useCallback((ticketData) => {
    setTickets((prevTickets) => [...prevTickets, ticketData]);
    setActiveSection('tickets'); // Cambiar a la sección de tickets después de cargar uno
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

          {activeSection === 'uploadTicket' && (
            <UploadTicket onUpload={handleUpload} />
          )}

          {activeSection === 'tickets' && (
            <Row xs={1} md={2} className="g-4">
              {tickets.map((ticket, index) => (
                <TicketCard key={index} ticket={ticket} />
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;