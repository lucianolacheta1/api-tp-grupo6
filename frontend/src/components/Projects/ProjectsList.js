import React, { useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import ProjectManager from './ProjectManager';

const ProjectsList = () => {
  const { authenticatedUser } = useContext(AuthContext);

  if (!authenticatedUser) {
    return <p>Please log in to view projects.</p>;
  }

  // Aquí solo estamos mostrando ProjectManager, que se encarga de toda la gestión
  return (
    <div>
      <h1>Projects</h1>
      <ProjectManager
        onSelectProject={(projectId) => console.log('Seleccionar proyecto:', projectId)}
        onDeleteProject={(projectId) => console.log('Eliminar proyecto:', projectId)}
      />
    </div>
  );
};

export default ProjectsList;
