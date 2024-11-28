const express = require('express');
const { register, login, getUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Cambia la importación aquí

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para obtener la información del usuario autenticado
router.get('/user', authenticateToken, getUser);

module.exports = router;
