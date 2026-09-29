const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { protect } = require('../middleware/auth');

// Protected route: Only authenticated users can access the chatbot/agent
router.post('/chat', protect, agentController.chat);

module.exports = router;
