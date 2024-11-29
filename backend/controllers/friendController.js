// controllers/friendController.js
const Friend = require('../models/Friend');

// Añadir un nuevo amigo
exports.addFriend = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  try {
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
    const friends = await Friend.find({ userId: req.user._id });
    res.status(200).json(friends);
  } catch (err) {
    console.error('Error al obtener amigos:', err);
    res.status(500).json({ message: 'Error al obtener los amigos' });
  }
};
