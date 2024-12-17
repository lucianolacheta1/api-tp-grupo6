const express = require('express');
const {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addTicketToProject,
  updateTicketInProject,
  deleteTicketFromProject,
  addMemberToProject,
  deleteMemberFromProject,
} = require('../controllers/projectController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para obtener todos los proyectos
router.get('/', authenticateToken, getAllProjects);

// Ruta para crear un nuevo proyecto
router.post('/', authenticateToken, createProject);

// Ruta para obtener un proyecto por ID
router.get('/:id', authenticateToken, getProjectById);

// Ruta para actualizar un proyecto por ID
router.patch('/:id', authenticateToken, updateProject);

// Ruta para eliminar un proyecto por ID
router.delete('/:id', authenticateToken, deleteProject);

// Ruta para añadir un ticket a un proyecto
router.post('/:id/tickets', authenticateToken, addTicketToProject);

// Modificar un ticket existente en un proyecto
router.put('/:projectId/tickets/:ticketId', authenticateToken, updateTicketInProject);

// Ruta para eliminar un ticket de un proyecto
router.delete('/:projectId/tickets/:ticketId', authenticateToken, deleteTicketFromProject);

// Ruta para añadir un miembro al proyecto
router.post('/:id/members', authenticateToken, addMemberToProject);

// Eliminar un miembro de un proyecto
router.delete('/:id/members/:memberId', authenticateToken, deleteMemberFromProject);


module.exports = router;
