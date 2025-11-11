// server/src/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// All message routes require auth
router.get('/conversations', auth, messageController.getConversations);
router.get('/:partnerId', auth, messageController.getMessages);
router.post('/:partnerId', auth, messageController.sendMessage);

module.exports = router;
