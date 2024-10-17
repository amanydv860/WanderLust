const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Ensure the token is extracted correctly

  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' }); // Check for invalid or expired token

    req.user = user; // Attach the user to the request
    next();
  });
};

module.exports = authenticateToken; 