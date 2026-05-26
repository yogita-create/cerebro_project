const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Ask question
router.post('/', chatController.chat);

// Get history
router.get("/session/:documentId/:sessionId", chatController.getChatHistory);
// GET all sessions
router.get("/sessions/:documentId", chatController.getAllSessions);

// DELETE session
router.delete("/session/:sessionId", chatController.deleteSession);

module.exports = router;
