import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects';

const getAuthToken = () => {
  // Supongamos que el token se almacena en localStorage
  return localStorage.getItem('authToken');
};

export const getProjects = async () => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};

export const createProject = async (project) => {
  const response = await axios.post(API_URL, project, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};

// Otros métodos para actualizar y eliminar proyectos