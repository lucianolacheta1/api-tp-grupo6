// routes/projectRoutes.js
const express = require('express');
const { getAllProjects, createProject, getProjectById, updateProject, deleteProject } = require('../controllers/projectController');
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

module.exports = router;
