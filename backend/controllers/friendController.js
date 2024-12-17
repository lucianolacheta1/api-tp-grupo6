// controllers/friendController.js
const Friend = require('../models/Friend');
const User = require('../models/User');

// Añadir un nuevo amigo
exports.addFriend = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.userId;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'No existe ningún usuario con ese email.' });
    }

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

// Eliminar un amigo
exports.deleteFriend = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const friend = await Friend.findOneAndDelete({ _id: id, userId });
    if (!friend) {
      return res.status(404).json({ message: 'Amigo no encontrado' });
    }
    res.status(200).json({ message: 'Amigo eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar amigo:', error);
    res.status(500).json({ message: 'Error al eliminar el amigo' });
  }
};
