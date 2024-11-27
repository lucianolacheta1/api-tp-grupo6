import React, { useEffect, useState, useContext } from 'react';
import { getProjects, createProject } from '../../api';
import { AuthContext } from '../Auth/AuthContext';

const ProjectsList = () => {
  const { authenticatedUser } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (authenticatedUser) {
      const fetchProjects = async () => {
        setLoading(true);
        try {
          const data = await getProjects();
          setProjects(data);
        } catch (error) {
          console.error('Error fetching projects:', error);
          setErrorMessage('Failed to load projects. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchProjects();
    }
  }, [authenticatedUser]);

  const handleCreateProject = async () => {
    setLoading(true);
    try {
      const newProject = { name: newProjectName };
      const createdProject = await createProject(newProject);
      setProjects([...projects, createdProject]);
      setNewProjectName('');
    } catch (error) {
      console.error('Error creating project:', error);
      setErrorMessage('Failed to create a project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!authenticatedUser) {
    return <p>Please log in to view projects.</p>;
  }

  return (
    <div>
      <h1>Projects</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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
          <button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
            Create Project
          </button>
        </>
      )}
    </div>
  );
};

export default ProjectsList;
