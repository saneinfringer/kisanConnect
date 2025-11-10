// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);

// Optional protected route
// const auth = require('../middleware/auth');
// router.get('/me', auth, userController.me);

module.exports = router;
