// authMiddleware.js
const jwt = require('jsonwebtoken');

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

module.exports = authenticateToken;

// Agregar configuración CORS
const cors = require('cors');

const configureCors = (app) => {
  app.use(cors({
    origin: 'http://localhost:3000', // Asegúrate de cambiar esta URL si se usa otra
    credentials: true,
  }));
};

module.exports = { authenticateToken, configureCors };
