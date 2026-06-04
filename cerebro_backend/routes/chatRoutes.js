const express = require("express");

const router = express.Router();

const chatController =
  require("../controllers/chatController");

const protect =
  require("../middleware/auth");

/* ===============================
   CHAT
=============================== */

router.post(
  "/",
  protect,
  chatController.chat
);

/* ===============================
   HISTORY
=============================== */

router.get(
  "/session/:documentId/:sessionId",
  protect,
  chatController.getChatHistory
);

/* ===============================
   SESSIONS
=============================== */

router.get(
  "/sessions/:documentId",
  protect,
  chatController.getAllSessions
);

/* ===============================
   DELETE SESSION
=============================== */

router.delete(
  "/session/:sessionId",
  protect,
  chatController.deleteSession
);

module.exports = router;