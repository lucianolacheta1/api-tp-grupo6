// server.js
const express = require('express'); // Asegúrate de importar express
const dotenv = require('dotenv');
<<<<<<< HEAD
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
app.use('/api/friends', friendRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.send('API is running...');
});
=======

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/items', require('./routes/items'));
app.use('/api/projects', require('./routes/projects')); // Nueva ruta

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
>>>>>>> 516becaee54ae9d835eaed5f64d93ca384b50a5e

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
<<<<<<< HEAD
});

module.exports = app;
=======

});
>>>>>>> 516becaee54ae9d835eaed5f64d93ca384b50a5e
