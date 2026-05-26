# Cerebro — RAG-Based PDF Q&A System

Cerebro is a full-stack **Retrieval-Augmented Generation (RAG)** application that allows users to upload PDF documents, process them into semantic embeddings, and ask contextual questions through an intelligent chat interface.

It supports:

- Secure user authentication (Login / Signup / Google OAuth)
- PDF upload & document management
- Chat sessions per document
- Session history tracking
- Regenerate answers
- Download & copy responses
- Responsive ChatGPT-style UI
- MongoDB Atlas cloud storage
- LLM-powered contextual answering

---

# Features

## Authentication System

- User Signup
- User Login
- Google OAuth Login
- Secure JWT authentication
- Session persistence

---

## Document Management

- Upload PDF documents
- Delete documents
- Store metadata in MongoDB
- Select active document

---

## RAG Pipeline

- PDF text extraction
- Text chunking
- Semantic embeddings generation
- Vector similarity retrieval
- LLM response generation

---

## Chat Features

- Ask document-based questions
- Session-wise conversations
- Regenerate same answer
- Copy response
- Download response
- Delete sessions
- Start new chat

---

## Responsive Interface

- Mobile sidebar toggle
- ChatGPT-style layout
- Toast notifications
- Animated branding

---

# Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js + Vite |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Authentication | JWT + Passport.js + Google OAuth |
| AI Pipeline | RAG + Embeddings + LLM |
| Styling | CSS3 |

---

# Project Structure

```bash
cerebro/
│
├── cerebro_backend/
│   │
│   ├── config/
│   │   ├── database.js
│   │   └── passport.js
│   │
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── chatController.js
│   │   └── documentController.js
│   │
│   ├── models/
│   │   ├── ChatHistory.js
│   │   ├── Document.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chatRoutes.js
│   │   └── documentRoutes.js
│   │
│   ├── services/
│   │   ├── chunkingService.js
│   │   ├── embeddingService.js
│   │   ├── llmService.js
│   │   ├── pdfService.js
│   │   └── searchService.js
│   │
│   ├── .env
│   ├── app.js
│   ├── server.js
│   ├── testServices.js
│   ├── testModel.js
│   └── package.json
│
│
├── cerebro_frontend/
│   │
│   ├── public/
│   │   └── logo.png
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Auth.jsx
│   │   │   └── Auth.css
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── Page.jsx
│   │   └── Page.css
│   │
│   ├── vite.config.js
│   └── package.json
│
├── package.json
└── README.md
```

---

# Prerequisites

Install:

- Node.js v18+
- npm
- MongoDB Atlas account
- Google OAuth credentials (optional for Google login)

Check version:

```bash
node -v
npm -v
```

---

# Environment Variables

Create:

```bash
cerebro_backend/.env
```

Add:

```env
PORT=5000

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_secret_key

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

FRONTEND_URL=http://localhost:5173
```

---

# Installation

From project root:

```bash
npm install
```

Install frontend:

```bash
cd cerebro_frontend
npm install
```

Install backend:

```bash
cd ../cerebro_backend
npm install
```

---

# Run Project

From root:

```bash
npm run dev
```

Runs both frontend and backend.

---

# Local URLs

Frontend:

```bash
http://localhost:5173
```

Backend:

```bash
http://localhost:5000
```

---

# Authentication Routes

## Signup

```http
POST /api/auth/signup
```

---

## Login

```http
POST /api/auth/login
```

---

## Google Login

```http
GET /api/auth/google
```

---

# API Endpoints

## Upload PDF

```http
POST /api/documents/upload
```

---

## Get Documents

```http
GET /api/documents
```

---

## Delete Document

```http
DELETE /api/documents/:id
```

---

## Ask Question

```http
POST /api/chat
```

---

## Get Sessions

```http
GET /api/chat/sessions/:documentId
```

---

## Load Session History

```http
GET /api/chat/session/:documentId/:sessionId
```

---

## Delete Session

```http
DELETE /api/chat/session/:id
```

---

# Startup Success Output

Backend terminal:

```bash
MongoDB Connected
Server running on port 5000
```

Frontend terminal:

```bash
VITE ready
Local: http://localhost:5173
```

---

# Troubleshooting

## MongoDB Connection Error

Check:

```env
MONGO_URI
```

---

## JWT Error

Verify:

```env
JWT_SECRET
```

---

## Google Login Not Working

Verify:

- Client ID
- Client Secret
- Redirect URI

---

## Port Already In Use

Change:

```env
PORT=5001
```

---

## Module Errors

Delete:

```bash
node_modules
package-lock.json
```

Reinstall:

```bash
npm install
```

---

# Future Enhancements

- Chat export as PDF
- User profile dashboard
- Dark/light theme switch
- LLM model selector
- Vector DB optimization
- Usage analytics

---



---

# Developer

**Yogita Sawant**  


Cerebro demonstrates practical expertise in:

- Retrieval-Augmented Generation (RAG)
- Full-stack application architecture
- Authentication & session management
- Semantic document search
- Modern responsive interface design
- MongoDB-backed production workflows

---

## Project Highlights

This project was designed to solve document intelligence challenges by combining semantic retrieval with LLM-powered contextual response generation, enabling users to interact naturally with uploaded PDFs through an intelligent conversational interface.