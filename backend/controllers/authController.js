const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});

// Registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, username });
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '¡Bienvenido a FairSplit!',
      text: `Hola ${username},\n\n¡Gracias por registrarte en FairSplit! Estamos muy contentos de tenerte a bordo.\n\nSaludos,\nEl equipo de FairSplit.`
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(201).json({ message: 'User registered successfully, but welcome email failed to send.' });
      } else {
        return res.status(201).json({ message: 'User registered successfully' });
      }
    });

  } catch (err) {
    console.error('Error en el proceso de registro:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
    console.error('Error al obtener la información del usuario:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
