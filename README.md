**Working URL** : https://cerebro-project.vercel.app/
# 🧠 Cerebro – AI-Powered PDF Question Answering System

Cerebro is a Retrieval-Augmented Generation (RAG) application that allows users to upload PDF documents and ask natural language questions about their content. The system retrieves the most relevant information from the uploaded document and generates context-aware answers using Large Language Models (LLMs).

---

## 🚀 Features

- 📄 Upload and process PDF documents
- ✂️ Automatic text extraction and chunking
- 🔍 Semantic search using vector embeddings
- 🤖 AI-powered question answering
- 💬 Interactive chat interface
- 📝 Chat history management
- 🎯 Multiple response modes
  - Long Answer
  - Medium Answer
  - Short Answer
  - Bullet Points
- ⚡ Fast document retrieval using vector similarity search

---

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### AI & NLP
- Groq API (Llama Model)
- Hugging Face Transformers
- BAAI/bge-small-en-v1.5 Embedding Model
- Retrieval-Augmented Generation (RAG)

### Tools
- Git & GitHub
- Postman
- VS Code

---

## 🏗️ System Architecture

```text
                PDF Upload
                     │
                     ▼
            Text Extraction
                     │
                     ▼
              Text Chunking
                     │
                     ▼
        Generate Vector Embeddings
                     │
                     ▼
            Store in MongoDB Atlas
                     │
                     ▼
              User Question
                     │
                     ▼
         Convert Question to Vector
                     │
                     ▼
        Similarity Search (Vector Search)
                     │
                     ▼
          Retrieve Relevant Chunks
                     │
                     ▼
     Send Context + Question to Groq LLM
                     │
                     ▼
            AI Generated Response
```

---

# 📂 Project Structure

```
Cerebro/
│
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── assets/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── config/
│
├── uploads/
├── package.json
└── README.md
```

---

# ⚙️ How It Works

### Step 1
Upload a PDF document.

### Step 2
The backend extracts all text from the PDF.

### Step 3
The extracted text is divided into smaller chunks.

### Step 4
Each chunk is converted into vector embeddings using the Hugging Face embedding model.

### Step 5
The embeddings are stored in MongoDB Atlas.

### Step 6
When the user asks a question, it is converted into an embedding.

### Step 7
The system performs semantic similarity search to retrieve the most relevant chunks.

### Step 8
The retrieved context and user question are sent to the Groq LLM.

### Step 9
The AI generates an accurate, context-aware answer.

---

# 💡 Key Features

- Retrieval-Augmented Generation (RAG)
- Semantic Document Search
- Context-Aware Responses
- Multiple Answer Formats
- PDF Processing
- Embedding Generation
- Vector Similarity Search
- Modern Responsive UI

---

# 📸 Screenshots

> Add screenshots of the application here.

Example:

```
screenshots/
├── Home.png
├── Upload.png
├── Chat.png
└── Result.png
```

---

# 📦 Installation

## Clone the repository

```bash
git clone https://github.com/your-username/Cerebro.git
```

## Navigate to the project

```bash
cd Cerebro
```

## Install dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd server
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

GROQ_API_KEY=your_groq_api_key
```

---

# ▶️ Run the Project

### Backend

```bash
cd server
npm start
```

### Frontend

```bash
cd client
npm run dev
```

---

# Future Improvements

- User Authentication
- Multi-document Support
- Conversation Memory
- Citation-Based Responses
- Streaming AI Responses
- Document Management Dashboard
- OCR Support for Scanned PDFs
- Support for DOCX and TXT files

---

# Learning Outcomes

This project helped me gain practical experience in:

- Retrieval-Augmented Generation (RAG)
- React.js Development
- REST API Development
- MongoDB Atlas
- Node.js & Express.js
- PDF Processing
- Vector Embeddings
- Semantic Search
- Prompt Engineering
- Large Language Model Integration

---

# Author

**Yogita Sawant**

Web Developer | Frontend Developer

Passionate about building AI-powered web applications using modern web technologies.
