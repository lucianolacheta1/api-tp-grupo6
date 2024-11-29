// authMiddleware.js
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
    },
    credentials: true,
  }));
};


// Exportar cada módulo por separado
module.exports.authenticateToken = authenticateToken;
module.exports.configureCors = configureCors;
