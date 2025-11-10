// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'please-change-me';

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    // const token = authHeader.replace('Bearer ', '').trim();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // verify token - jwt.verify will throw if invalid/expired
    const payload = jwt.verify(token, JWT_SECRET);

    // payload should have the user id (we sign with { id: user._id } or similar)
    const userId = payload.id || payload._id || payload.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // find the user by id (do not require tokens array in user model)
    const user = await User.findById(userId).select('-passwordHash'); // exclude password field (if stored as `password`)
    if (!user) {
      return res.status(401).json({ message: 'User not found for provided token' });
    }

    // attach to request
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    // Log for server-side debugging (avoid leaking sensitive info to client)
    console.error('Auth middleware error:', err && err.message ? err.message : err);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};