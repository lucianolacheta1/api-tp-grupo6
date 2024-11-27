// api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const getProjects = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const createProject = async (project) => {
  try {
    const response = await axios.post(API_URL, project, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Actualizar proyecto
export const updateProject = async (projectId, updatedProject) => {
  try {
    const response = await axios.patch(`${API_URL}/${projectId}`, updatedProject, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Eliminar proyecto
export const deleteProject = async (projectId) => {
  try {
    const response = await axios.delete(`${API_URL}/${projectId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
