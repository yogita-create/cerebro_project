const express = require("express");
const multer = require("multer");
const documentController = require("../controllers/documentController");

const router = express.Router();

// ============================
// Upload Config
// ============================
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "text/plain",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF and TXT files are allowed"
        )
      );
    }
  },
});

// ============================
// Routes
// ============================

// Upload PDF / TXT
router.post(
  "/upload",
  upload.single("file"),
  documentController.uploadDocument
);

// Get all documents
router.get(
  "/",
  documentController.listDocuments
);

// Get single document
router.get(
  "/:id",
  documentController.getDocument
);

// Delete document
router.delete(
  "/:id",
  documentController.deleteDocument
);

module.exports = router;