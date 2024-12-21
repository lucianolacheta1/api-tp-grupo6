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
  getProjectBalances, // Importar la nueva función
} = require('../controllers/projectController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas existentes
router.get('/', authenticateToken, getAllProjects);
router.post('/', authenticateToken, createProject);
router.get('/:id', authenticateToken, getProjectById);
router.patch('/:id', authenticateToken, updateProject);
router.delete('/:id', authenticateToken, deleteProject);
router.post('/:id/tickets', authenticateToken, addTicketToProject);
router.put('/:projectId/tickets/:ticketId', authenticateToken, updateTicketInProject);
router.delete('/:projectId/tickets/:ticketId', authenticateToken, deleteTicketFromProject);
router.post('/:id/members', authenticateToken, addMemberToProject);
router.delete('/:id/members/:memberId', authenticateToken, deleteMemberFromProject);

// Nueva ruta para obtener balances
router.get('/:id/balances', authenticateToken, getProjectBalances);

module.exports = router;
