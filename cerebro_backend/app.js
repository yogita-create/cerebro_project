const express = require('express');
const cors = require('cors');
require('dotenv').config();

const documentRoutes = require('./routes/documentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const app = express();

//  CORS FIX (MAIN ISSUE)
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

//  Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

//  Routes
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);

//  Root
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Cerebro API',
    endpoints: {
      upload: 'POST /api/documents/upload',
      chat: 'POST /api/chat'
    }
  });
});

//  Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Cerebro Backend is Running',
    timestamp: new Date()
  });
});

//  Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
