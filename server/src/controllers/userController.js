//updated
// src/controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET not set in environment. Please set process.env.JWT_SECRET');
  process.exit(1);
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * POST /api/users/register
 * Body: { name, phone, password, role, email? }
 */
exports.register = async (req, res, next) => {
  try {
    const { name, phone, password, role, email } = req.body;

    if (!name || !phone || !password || !role) {
      return res.status(400).json({ message: 'Name, phone, password and role are required.' });
    }

    if (!['farmer', 'buyer'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either "farmer" or "buyer".' });
    }

    // Check if phone already exists
    const existingByPhone = await User.findOne({ phone });
    if (existingByPhone) {
      return res.status(409).json({ message: 'Phone number already registered.' });
    }

    // If email provided, ensure it's not already in use
    if (email) {
      const existingByEmail = await User.findOne({ email });
      if (existingByEmail) {
        return res.status(409).json({ message: 'Email already in use.' });
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    // Create user (email is optional)
    const user = new User({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : undefined,
      password: hashed,
      role,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, phone: user.phone, role: user.role }
    });
  } catch (err) {
    console.error('Register error:', err);
    next(err);
  }
};

/**
 * POST /api/users/login
 * Body: { phone, password }  (also accepts email for backward compatibility)
 */
exports.login = async (req, res, next) => {
  try {
    const identifier = req.body.phone || req.body.email || req.body.username || req.body.identifier;
    const password = req.body.password;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Phone/email and password are required.' });
    }

    // Try by phone first, then email, then name
    let user = await User.findOne({ phone: identifier });
    if (!user) user = await User.findOne({ email: identifier });
    if (!user) user = await User.findOne({ name: identifier });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({
      token,
      user: { id: user._id, name: user.name, phone: user.phone, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
};
