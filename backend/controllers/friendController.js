// controllers/friendController.js
const Friend = require('../models/Friend');
const User = require('../models/User');

// Añadir un nuevo amigo
exports.addFriend = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.userId;

  try {
    // Verificar si existe un usuario con el email proporcionado
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'No existe ningún usuario con ese email.' });
    }

    // Si el usuario existe, crear el amigo
    const newFriend = new Friend({ userId, name, email });
    await newFriend.save();
    res.status(201).json({ message: 'Amigo añadido con éxito', friend: newFriend });
  } catch (err) {
    console.error('Error al añadir amigo:', err);
    res.status(500).json({ message: 'Error al añadir el amigo' });
  }
};

// Obtener amigos del usuario autenticado
exports.getFriends = async (req, res) => {
  try {
    const friends = await Friend.find({ userId: req.user.userId });
    res.status(200).json(friends);
  } catch (err) {
    console.error('Error al obtener amigos:', err);
    res.status(500).json({ message: 'Error al obtener los amigos' });
  }
};
