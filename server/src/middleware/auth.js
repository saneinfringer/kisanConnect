/// updated auth for messages feature
// server/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET not set. Set process.env.JWT_SECRET and restart the server.');
  // fail fast to avoid silent token mismatches
  process.exit(1);
}

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    // ✅ Extract token correctly (don’t re-sign)
    const token = authHeader.replace('Bearer ', '').trim();

    // ✅ Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // ✅ Extract user ID from payload
    const userId = payload.id || payload._id || payload.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // ✅ Find user
    const user = await User.findById(userId).select('-password'); // exclude password field
    if (!user) {
      return res.status(401).json({ message: 'User not found for provided token' });
    }

    // ✅ Attach to request
    req.user = { id: user._id, name: user.name, role: user.role };
    req.token = token;

    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message || err);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};
