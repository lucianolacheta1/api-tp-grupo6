// routes/friendRoutes.js
const express = require('express');
const router = express.Router();
const { addFriend, getFriends, deleteFriend } = require('../controllers/friendController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Ruta para añadir un amigo
router.post('/add', authenticateToken, addFriend);

// Ruta para obtener todos los amigos del usuario autenticado
router.get('/', authenticateToken, getFriends);

// Ruta para eliminar un amigo por ID
router.delete('/:id', authenticateToken, deleteFriend);

module.exports = router;
