import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects';
const FRIENDS_API_URL = 'http://localhost:5000/api/friends';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Obtener todos los proyectos
export const getProjects = async () => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};

// Crear un proyecto
export const createProject = async (project) => {
  const response = await axios.post(API_URL, project, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};

// Obtener un proyecto por ID
export const getProjectById = async (projectId) => {
  const response = await axios.get(`${API_URL}/${projectId}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};

// Actualizar proyecto
export const updateProject = async (projectId, updatedProject) => {
  const response = await axios.patch(`${API_URL}/${projectId}`, updatedProject, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};

// Eliminar proyecto
export const deleteProject = async (projectId) => {
  const response = await axios.delete(`${API_URL}/${projectId}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};

// Obtener amigos
export const getFriends = async () => {
  const response = await axios.get(FRIENDS_API_URL, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};

// Añadir un amigo
export const addFriend = async (friend) => {
  const response = await axios.post(`${FRIENDS_API_URL}/add`, friend, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};

// Eliminar un amigo
export const deleteFriend = async (friendId) => {
  const response = await axios.delete(`${FRIENDS_API_URL}/${friendId}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};

// Actualizar un ticket en un proyecto
export const updateTicketInProject = async (projectId, ticketId, updatedData) => {
  const response = await axios.put(`${API_URL}/${projectId}/tickets/${ticketId}`, updatedData, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};

// Eliminar un ticket de un proyecto
export const deleteTicketFromProject = async (projectId, ticketId) => {
  const response = await axios.delete(`${API_URL}/${projectId}/tickets/${ticketId}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};

// Añadir un miembro al proyecto
export const addMemberToProject = async (projectId, memberData) => {
  const response = await axios.post(`${API_URL}/${projectId}/members`, memberData, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};

// Eliminar un miembro del proyecto
export const deleteMemberFromProject = async (projectId, memberId) => {
  const response = await axios.delete(`${API_URL}/${projectId}/members/${memberId}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};


// Añadir un gasto al proyecto
export const addExpenseToProject = async (projectId, expenseData) => {
  const response = await axios.post(`${API_URL}/${projectId}/expenses`, expenseData, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};

// Añadir un ticket al proyecto
export const addTicketToProject = async (projectId, ticketData) => {
  const response = await axios.post(`${API_URL}/${projectId}/tickets`, ticketData, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};
