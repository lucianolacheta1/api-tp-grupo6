import React, { useState } from 'react';

// Componente para crear y gestionar proyectos
function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const handleCreateProject = () => {
    const newProject = {
      id: projects.length + 1,
      name: projectName,
      description: projectDescription,
      members: [],
      expenses: []
    };
    setProjects([...projects, newProject]);
    setProjectName('');
    setProjectDescription('');
  };

  return (
    <div className="container">
      <h2>Gestión de Proyectos</h2>
      <div className="mb-3">
        <label htmlFor="projectName" className="form-label">Nombre del Proyecto</label>
        <input
          type="text"
          id="projectName"
          className="form-control"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="projectDescription" className="form-label">Descripción del Proyecto</label>
        <input
          type="text"
          id="projectDescription"
          className="form-control"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        />
      </div>
      <button onClick={handleCreateProject} className="btn btn-primary">Crear Proyecto</button>
      
      <h3 className="mt-4">Proyectos Actuales</h3>
      <ul className="list-group">
        {projects.map((project) => (
          <li key={project.id} className="list-group-item">
            <h5>{project.name}</h5>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectManager;
