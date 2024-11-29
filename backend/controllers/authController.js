const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Crear el transportador para el correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Tu email
    pass: process.env.EMAIL_PASS  // Contraseña del email (puede ser una app password)
  }
});

// Registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    console.log('Intentando registrar un usuario...');

    const { email, password, username } = req.body;
    console.log('Datos recibidos para el registro:', { email, username });

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.error('Usuario ya existe:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Contraseña encriptada exitosamente');

    const user = new User({ email, password: hashedPassword, username });
    await user.save();
    console.log('Usuario registrado exitosamente en la base de datos:', user);

    // Enviar correo de bienvenida
    const mailOptions = {
      from: process.env.EMAIL_USER, // Tu email
      to: email, // Email del usuario registrado
      subject: '¡Bienvenido a FairSplit!',
      text: `Hola ${username},\n\n¡Gracias por registrarte en FairSplit! Estamos muy contentos de tenerte a bordo.\n\nSaludos,\nEl equipo de FairSplit.`
    };

    console.log('Intentando enviar correo de bienvenida a:', email);
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(201).json({ message: 'User registered successfully, but welcome email failed to send.' });
      } else {
        console.log('Correo enviado con éxito:', info.response);
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
    console.log('Intentando obtener la información del usuario:', req.user.userId);

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      console.error('Usuario no encontrado:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Información del usuario encontrada:', user);
    res.json(user);
  } catch (err) {
    console.error('Error al obtener la información del usuario:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
