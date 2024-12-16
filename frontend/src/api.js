import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects';
const FRIENDS_API_URL = 'http://localhost:5000/api/friends';

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
    const response = await axios.get(FRIENDS_API_URL, {
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
    const response = await axios.post(`${FRIENDS_API_URL}/add`, friend, {
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

// Actualizar un ticket en un proyecto
export const updateTicketInProject = async (projectId, ticketId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${projectId}/tickets/${ticketId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

// Eliminar un ticket de un proyecto
export const deleteTicketFromProject = async (projectId, ticketId) => {
  try {
    const response = await axios.delete(`${API_URL}/${projectId}/tickets/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
};

// Añadir un miembro al proyecto
export const addMemberToProject = async (projectId, memberData) => {
  try {
    const response = await axios.post(`${API_URL}/${projectId}/members`, memberData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding member to project:', error);
    throw error;
  }
};

// Añadir un gasto al proyecto
export const addExpenseToProject = async (projectId, expenseData) => {
  try {
    const response = await axios.post(`${API_URL}/${projectId}/expenses`, expenseData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding expense to project:', error);
    throw error;
  }
};

// Añadir un ticket al proyecto
export const addTicketToProject = async (projectId, ticketData) => {
  try {
    const response = await axios.post(`${API_URL}/${projectId}/tickets`, ticketData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding ticket to project:', error);
    throw error;
  }
};
