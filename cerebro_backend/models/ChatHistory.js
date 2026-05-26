const mongoose = require("mongoose");

const chatHistory = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//  CRITICAL FIX (prevents overwrite bug)
module.exports = mongoose.models.ChatHistory || mongoose.model("ChatHistory", chatHistory);
