import React, { useEffect, useState } from 'react';
import { getProjects, createProject } from './api';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    try {
      const newProject = { name: newProjectName };
      const createdProject = await createProject(newProject);
      setProjects([...projects, createdProject]);
      setNewProjectName('');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newProjectName}
        onChange={(e) => setNewProjectName(e.target.value)}
        placeholder="New Project Name"
      />
      <button onClick={handleCreateProject}>Create Project</button>
    </div>
  );
};

export default ProjectsList;