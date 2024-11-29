// routes/friendRoutes.js
const express = require('express');
const router = express.Router();
const { addFriend, getFriends } = require('../controllers/friendController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Ruta para añadir un amigo
router.post('/add', authenticateToken, addFriend);

// Ruta para obtener todos los amigos del usuario autenticado
router.get('/', authenticateToken, getFriends);

module.exports = router;
