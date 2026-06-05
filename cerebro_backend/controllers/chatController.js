const mongoose = require("mongoose");
const llmService = require("../services/llmService");
const embeddingService = require("../services/embeddingService");
const searchService = require("../services/searchService");
const ChatHistory = require("../models/ChatHistory");

class ChatController {

  /* ===============================
     CHAT
  =============================== */
  async chat(req, res) {
    try {
      console.log("CHAT FUNCTION HIT");

      const {
        question,
        documentId,
        sessionId,
      } = req.body || {};

      /* ===============================
         VALIDATION
      =============================== */
      if (!question || !documentId) {
        return res.status(400).json({
          success: false,
          error: "question and documentId required",
        });
      }

      /* ===============================
         USER FROM JWT MIDDLEWARE
      =============================== */
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
      }

      const cleanQuestion = question.trim();

      console.log(" Creating embedding...");

      /* ===============================
         EMBEDDING
      =============================== */
      const embedding =
        await embeddingService.embedText(
          cleanQuestion,
          true
        );

      console.log(" Searching similar chunks...");

      /* ===============================
         VECTOR SEARCH
      =============================== */
      const chunks =
        await searchService.searchSimilarChunks(
          embedding,
          documentId,
          7
        );

      console.log(" Chunks found:", chunks.length);

      /* ===============================
         NO RESULT
      =============================== */
      if (!chunks.length) {
        return res.json({
          success: true,
          answer: "Answer not found in the document",
          sessionId: sessionId || null,
        });
      }

      /* ===============================
         CONTEXT BUILDING
      =============================== */
      const context = chunks
        .map((c) => c.text)
        .join("\n\n");

      console.log(" Generating AI answer...");

      /* ===============================
         GENERATE ANSWER
      =============================== */
      const answer =
        await llmService.generateAnswer(
          cleanQuestion,
          context
        );

      const currentSessionId =
        sessionId || `session_${Date.now()}`;

      /* ===============================
         SAVE CHAT
      =============================== */
      const saved = await ChatHistory.create({
        userId,
        documentId:
          new mongoose.Types.ObjectId(documentId),
        sessionId: currentSessionId,
        question: cleanQuestion,
        answer,
      });

      console.log(" Chat saved:", saved._id);

      /* ===============================
         RESPONSE
      =============================== */
      return res.json({
        success: true,
        answer,
        sessionId: currentSessionId,
      });

    } catch (error) {

      console.error(" CHAT ERROR:", error);

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /* ===============================
     GET CHAT HISTORY
  =============================== */
  async getChatHistory(req, res) {
    try {

      const {
        documentId,
        sessionId,
      } = req.params;

      const chats = await ChatHistory.find({
        documentId:
          new mongoose.Types.ObjectId(documentId),
        sessionId,
      }).sort({ createdAt: 1 });

      return res.json({
        success: true,
        chats,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /* ===============================
     GET ALL SESSIONS
  =============================== */
  async getAllSessions(req, res) {
    try {

      const { documentId } = req.params;

      const sessions =
        await ChatHistory.aggregate([
          {
            $match: {
              documentId:
                new mongoose.Types.ObjectId(
                  documentId
                ),
            },
          },
          {
            $sort: {
              createdAt: 1,
            },
          },
          {
            $group: {
              _id: "$sessionId",
              firstQuestion: {
                $first: "$question",
              },
              createdAt: {
                $first: "$createdAt",
              },
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
        ]);

      return res.json({
        success: true,
        sessions,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /* ===============================
     DELETE SESSION
  =============================== */
  async deleteSession(req, res) {
    try {

      const { sessionId } = req.params;

      await ChatHistory.deleteMany({
        sessionId,
      });

      return res.json({
        success: true,
        message: "Session deleted successfully",
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

const controller = new ChatController();

module.exports = {
  chat: controller.chat.bind(controller),
  getChatHistory:
    controller.getChatHistory.bind(controller),
  getAllSessions:
    controller.getAllSessions.bind(controller),
  deleteSession:
    controller.deleteSession.bind(controller),
};