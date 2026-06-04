const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    mode: {
      type: String,
      default: "long",
    },

    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
        },
        content: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.ChatHistory ||
  mongoose.model("ChatHistory", chatHistorySchema);