const mongoose = require("mongoose");
const llmService = require("../services/llmService");
const embeddingService = require("../services/embeddingService");
const searchService = require("../services/searchService");
const ChatHistory = require("../models/ChatHistory");

console.log(" CONTROLLER LOADED");

class ChatController {

  // ===============================
  // CHAT
  // ===============================
  async chat(req, res) {
    try {
      console.log(" CHAT FUNCTION HIT");

      const { question, documentId, sessionId } = req.body;

      if (!question || !documentId) {
        return res.status(400).json({
          success: false,
          error: "question and documentId required",
        });
      }

      const cleanQuestion = question.trim();

      const embedding = await embeddingService.embedText(cleanQuestion, true);

      const chunks = await searchService.searchSimilarChunks(
        embedding,
        documentId,
        7
      );

      if (!chunks.length) {
        return res.json({
          success: true,
          answer: "Answer not found in the document",
        });
      }

      const context = chunks.map(c => c.text).join("\n\n");

      const answer = await llmService.generateAnswer(cleanQuestion, context);

      const currentSessionId = sessionId || `session_${Date.now()}`;

      //  SAVE CHAT
      const saved = await ChatHistory.create({
        documentId: new mongoose.Types.ObjectId(documentId),
        sessionId: currentSessionId,
        question: cleanQuestion,
        answer,
      });

      console.log("Chat saved:", saved._id);

      return res.json({
        success: true,
        answer,
        sessionId: currentSessionId,
      });

    } catch (error) {
      console.error("❌ Chat Error:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // ===============================
  // GET CHAT HISTORY (PER SESSION)
  // ===============================
  async getChatHistory(req, res) {
    try {
      const { documentId, sessionId } = req.params;

      const chats = await ChatHistory.find({
        documentId: new mongoose.Types.ObjectId(documentId),
        sessionId,
      }).sort({ createdAt: 1 });

      return res.json({
        success: true,
        chats,
      });

    } catch (error) {
      console.error("❌ History Error:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // ===============================
  // GET ALL SESSIONS (SIDEBAR)
  // ===============================
  async getAllSessions(req, res) {
    try {
      const { documentId } = req.params;

      const sessions = await ChatHistory.aggregate([
        {
          $match: {
            documentId: new mongoose.Types.ObjectId(documentId),
          },
        },
        {
          $sort: { createdAt: 1 }, // important for first question
        },
        {
          $group: {
            _id: "$sessionId",
            firstQuestion: { $first: "$question" },
            createdAt: { $first: "$createdAt" },
          },
        },
        {
          $sort: { createdAt: -1 }, // latest on top
        },
      ]);

      return res.json({
        success: true,
        sessions,
      });

    } catch (error) {
      console.error("❌ Sessions Error:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // ===============================
  //  DELETE SESSION
  // ===============================
  async deleteSession(req, res) {
    try {
      const { sessionId } = req.params;

      await ChatHistory.deleteMany({ sessionId });

      return res.json({
        success: true,
        message: "Session deleted successfully",
      });

    } catch (error) {
      console.error("❌ Delete Error:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

// EXPORT (VERY IMPORTANT)
const controller = new ChatController();

module.exports = {
  chat: controller.chat.bind(controller),
  getChatHistory: controller.getChatHistory.bind(controller),
  getAllSessions: controller.getAllSessions.bind(controller),
  deleteSession: controller.deleteSession.bind(controller),
};
