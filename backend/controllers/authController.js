const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, username });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Intento de login:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.error('Usuario no encontrado:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Usuario encontrado:', user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Contraseña incorrecta:', password);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generado:', token);
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error en el proceso de login:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Obtener la información del usuario autenticado
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
