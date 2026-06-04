const mongoose = require('mongoose');

// 🔹 Chunk Schema
const chunkSchema = new mongoose.Schema({
  chunkId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number], // vector
    required: true
  },
  chunkIndex: {
    type: Number,
    required: true
  },
  metadata: {
    pageNumber: {
      type: Number,
      default: null
    },
    source: {
      type: String
    }
  }
});

// 🔹 Document Schema
const documentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},
  totalChunks: {
    type: Number,
    default: 0
  },
  chunks: [chunkSchema], //  Embedded chunks
  status: {
    type: String,
    enum: ['uploading', 'processing', 'completed', 'failed'],
    default: 'uploading'
  },
  errorMessage: {
    type: String,
    default: null
  }
});

//  IMPORTANT: prevent re-compiling model (fix crashes in dev)
module.exports = mongoose.models.Document || mongoose.model('Document', documentSchema);
