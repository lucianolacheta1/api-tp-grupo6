// server.js
const express = require('express'); // Asegúrate de importar express
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Importa el archivo de conexión a la BD
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const friendRoutes = require('./routes/friendRoutes'); // Añadir rutas de amigos
const { configureCors } = require('./middleware/authMiddleware');

dotenv.config();

const app = express(); // Uso de express después de importarlo
const PORT = process.env.PORT || 5000;

// Conectar a la base de datos
connectDB();

// Middleware
configureCors(app);
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/friends', friendRoutes); // Añadir rutas de amigos

// Ruta principal
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
