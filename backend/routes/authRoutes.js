// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, getAuthenticatedUser } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para obtener la información del usuario autenticado
router.get('/user', authenticateToken, getAuthenticatedUser);

module.exports = router;
