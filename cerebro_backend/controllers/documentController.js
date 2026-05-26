const Document = require("../models/Document");
const ChatHistory = require("../models/ChatHistory");

const pdfService = require("../services/pdfService");
const chunkingService = require("../services/chunkingService");
const embeddingService = require("../services/embeddingService");

// ===============================
// UPLOAD DOCUMENT
// ===============================
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    const fileName = req.file.originalname;
    const fileBuffer = req.file.buffer;

    console.log("📄 Processing:", fileName);

    let text = "";

    // ===============================
    // PDF
    // ===============================
    if (req.file.mimetype === "application/pdf") {
      const result =
        await pdfService.extractText(fileBuffer);

      text = result.text;
    }

    // ===============================
    // TXT
    // ===============================
    else if (
      req.file.mimetype === "text/plain"
    ) {
      text = fileBuffer.toString("utf-8");
    }

    else {
      throw new Error(
        "Unsupported file type"
      );
    }

    console.log(
      "Extracted length:",
      text.length
    );

    // ===============================
    // CHUNKING
    // ===============================
    const rawChunks =
      await chunkingService.chunkText(text);

    console.log(
      "Chunks:",
      rawChunks.length
    );

    const chunks = [];

    for (
      let i = 0;
      i < rawChunks.length;
      i++
    ) {
      let chunkText =
        rawChunks[i]?.text;

      if (
        typeof chunkText !== "string"
      ) {
        chunkText = String(
          chunkText
        );
      }

      chunkText =
        chunkText.trim();

      if (
        !chunkText ||
        chunkText.length < 30
      ) {
        continue;
      }

      const embedding =
        await embeddingService.embedText(
          chunkText,
          false
        );

      if (
        !embedding ||
        embedding.length === 0
      ) {
        continue;
      }

      chunks.push({
        chunkId: i.toString(),
        text: chunkText,
        embedding,
        chunkIndex: i,
      });
    }

    if (
      chunks.length === 0
    ) {
      throw new Error(
        "No valid chunks created"
      );
    }

    // ===============================
    // SAVE
    // ===============================
    const document =
      new Document({
        fileName,
        fileSize:
          req.file.size,
        totalChunks:
          chunks.length,
        chunks,
        status:
          "completed",
      });

    const savedDoc =
      await document.save();

    console.log(
      " Saved ID:",
      savedDoc._id
    );

    res.json({
      success: true,
      message:
        "Document uploaded successfully",
      id: savedDoc._id,
    });

  } catch (error) {
    console.error(
      "❌ Upload Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      error:
        error.message,
    });
  }
};

// ===============================
// LIST DOCUMENTS
// ===============================
const listDocuments =
  async (req, res) => {
    try {
      const docs =
        await Document.find(
          {},
          {
            "chunks.embedding": 0,
          }
        );

      res.json({
        success: true,
        documents: docs,
      });

    } catch (error) {
      console.error(
        "❌ List Error:",
        error.message
      );

      res.status(500).json({
        success: false,
        error:
          error.message,
      });
    }
  };

// ===============================
// GET SINGLE DOCUMENT
// ===============================
const getDocument =
  async (req, res) => {
    try {
      const doc =
        await Document.findById(
          req.params.id,
          {
            "chunks.embedding": 0,
          }
        );

      if (!doc) {
        return res.status(
          404
        ).json({
          success: false,
          error:
            "Document not found",
        });
      }

      res.json({
        success: true,
        document: doc,
      });

    } catch (error) {
      console.error(
        "❌ Get Error:",
        error.message
      );

      res.status(500).json({
        success: false,
        error:
          error.message,
      });
    }
  };

// ===============================
// DELETE DOCUMENT
// ===============================
const deleteDocument =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const deleted =
        await Document.findByIdAndDelete(
          id
        );

      if (!deleted) {
        return res.status(
          404
        ).json({
          success: false,
          error:
            "Document not found",
        });
      }

      // Delete related chats
      await ChatHistory.deleteMany(
        {
          documentId: id,
        }
      );

      res.json({
        success: true,
        message:
          "Document deleted successfully",
      });

    } catch (error) {
      console.error(
        "❌ Delete Error:",
        error.message
      );

      res.status(500).json({
        success: false,
        error:
          error.message,
      });
    }
  };

// ===============================
// EXPORT
// ===============================
module.exports = {
  uploadDocument,
  listDocuments,
  getDocument,
  deleteDocument,
};