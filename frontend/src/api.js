import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Obtener todos los proyectos
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

// Crear un proyecto
export const createProject = async (project) => {
  try {
    console.log('Intentando crear proyecto con datos:', project);
    const response = await axios.post(API_URL, project, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    console.log('Respuesta al crear proyecto:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Obtener un proyecto por ID
export const getProjectById = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/${projectId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching project by ID:', error);
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

// Obtener amigos
export const getFriends = async () => {
  try {
    const response = await axios.get(`${API_URL}/friends`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching friends:', error);
    throw error;
  }
};

// Añadir un amigo
export const addFriend = async (friend) => {
  try {
    const response = await axios.post(`${API_URL}/friends/add`, friend, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
};