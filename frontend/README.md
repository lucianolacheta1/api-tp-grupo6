Documentación del Proyecto


Descripción del Proyecto
Este proyecto es una aplicación de gestión de proyectos que permite a los usuarios crear proyectos, agregar amigos como miembros a los proyectos y enviar notificaciones por correo electrónico a los amigos cuando son añadidos a un proyecto. La aplicación utiliza Node.js, Express, MongoDB y Nodemailer para la funcionalidad del backend.

Estructura del Proyecto

api-tp-grupo6
├── backend
│   ├── config
│   │   ├── db.js
│   │   └── mailer.js
│   ├── controllers
│   │   ├── friendController.js
│   │   └── projectController.js
│   ├── middleware
│   │   └── authMiddleware.js
│   ├── models
│   │   ├── Friend.js
│   │   ├── Project.js
│   │   └── User.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── friendRoutes.js
│   │   └── projectRoutes.js
│   ├── .env
│   └── server.js
└── README.md



Configuración del Proyecto
Variables de Entorno
Crea un archivo .env en la raíz del proyecto con el siguiente contenido:

MONGO_URI=mongodb://localhost:27017/splitwise
JWT_SECRET=misuperclavesecreta
PORT=5000
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña

Instalación de Dependencias
Ejecuta el siguiente comando para instalar las dependencias necesarias:
npm install


Configuración de la Base de Datos
Conexión a MongoDB
El archivo config/db.js contiene la configuración para conectar a MongoDB:
// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Salir del proceso con un error si no se puede conectar
  }
};

module.exports = connectDB;


Configuración de Nodemailer
El archivo config/mailer.js contiene la configuración para enviar correos electrónicos utilizando Nodemailer:

// config/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes usar cualquier servicio de correo compatible
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;

Modelos de Datos
Modelo de Usuario
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);

Modelo de Amigo

// models/Friend.js
const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Friend', friendSchema);

Modelo de Proyecto

// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
});

module.exports = mongoose.model('Project', projectSchema);

Controladores
Controlador de Amigos

// controllers/friendController.js
const Friend = require('../models/Friend');
const User = require('../models/User');

// Añadir un nuevo amigo
exports.addFriend = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.userId;

  try {
    // Verificar si el usuario existe
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'No existe ningún usuario con ese email.' });
    }

    // Verificar si ya es amigo del usuario actual
    const existingFriend = await Friend.findOne({ userId, email });
    if (existingFriend) {
      return res.status(400).json({ message: 'Este usuario ya es tu amigo.' });
    }

    // Crear un nuevo amigo
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

  try {
    const friend = await Friend.findOneAndDelete({ _id: id, userId: req.user.userId });
    if (!friend) {
      return res.status(404).json({ message: 'Amigo no encontrado' });
    }

    res.status(200).json({ message: 'Amigo eliminado con éxito' });
  } catch (err) {
    console.error('Error al eliminar amigo:', err);
    res.status(500).json({ message: 'Error al eliminar el amigo' });
  }
};


Controlador de Proyectos
// controllers/projectController.js


Rutas
Rutas de Autenticación

// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

module.exports = router;



Middleware de Autenticación

// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Middleware para autenticar el token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Configuración CORS
const configureCors = (app) => {
  const allowedOrigins = ['http://localhost:3000']; // Lista de orígenes permitidos
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }));
};

module.exports = { authenticateToken, configureCors };















La aplicación utiliza React para la funcionalidad del frontend.

frontend
├── public
│   ├── index.html
│   └── ...
├── src
│   ├── components
│   │   ├── AuthContext.js
│   │   ├── ProjectManager.js
│   │   ├── ProjectsList.js
│   │   └── ProjectDetails.js
│   ├── App.js
│   ├── index.js
│   └── ...
├── .env
├── package.json
└── README.md



Componentes Principales
Contexto de Autenticación

// src/components/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/user`, { withCredentials: true });
        setAuthenticatedUser(response.data);
      } catch (error) {
        console.error('Error fetching authenticated user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticatedUser, setAuthenticatedUser }}>
      {children}
    </AuthContext.Provider>
  );
};



Lista de Proyectos

// src/components/ProjectsList.js
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import ProjectManager from './ProjectManager';

const ProjectsList = () => {
  const { authenticatedUser } = useContext(AuthContext);

  if (!authenticatedUser) {
    return <div>Please log in to view your projects.</div>;
  }

  return (
    <div>
      <h1>Projects</h1>
      <ProjectManager
        onSelectProject={(projectId) => console.log('Seleccionar proyecto:', projectId)}
        onDeleteProject={(projectId) => console.log('Eliminar proyecto:', projectId)}
      />
    </div>
  );
};

export default ProjectsList;


Detalles del Proyecto

// src/components/ProjectDetails.js



Configuración de Rutas
Archivo App.js

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import ProjectsList from './components/ProjectsList';
import ProjectDetails from './components/ProjectDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProjectsList />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


Archivo index.js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);