**Working URL** : https://cerebro-project.vercel.app/
<div align="center">

# 🧠 Cerebro

### AI-Powered Retrieval-Augmented Generation (RAG) PDF Question Answering System

Upload PDF documents and ask questions in natural language. Cerebro retrieves the most relevant information using semantic search and generates accurate answers using Large Language Models (LLMs).

<p>

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![NodeJS](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success?logo=mongodb)
![Groq](https://img.shields.io/badge/Groq-LLM-orange)
![RAG](https://img.shields.io/badge/RAG-System-purple)
![License](https://img.shields.io/badge/License-MIT-blue)

</p>

🌐 **Live Demo**

https://cerebro-project.vercel.app/

⭐ If you like this project, don't forget to star the repository.

</div>

---

# 🎥 Demo

> Replace this image with your GIF later.

```
demo/demo.gif
```

or

```
screenshots/chat.gif
```

---

# 📸 Screenshots

```
screenshots/
│
├── Home.png
├── Upload.png
├── Chat.png
├── Result.png
└── History.png
```

---

# ✨ Features

- 📄 Upload PDF documents
- 📑 Automatic text extraction
- ✂️ Intelligent text chunking
- 🔍 Semantic similarity search
- 🤖 AI-powered Question Answering
- 💬 Interactive Chat Interface
- 📝 Chat History
- ⚡ Fast Response Generation
- 🎯 Multiple Answer Modes
  - Long
  - Medium
  - Short
  - Bullet Points
- 📱 Responsive UI

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- HTML5
- CSS3
- JavaScript (ES6+)

---

## Backend

- Node.js
- Express.js

---

## Database

- MongoDB Atlas

---

## AI

- Groq API
- Llama Model
- Hugging Face Transformers
- BAAI/bge-small-en-v1.5
- Retrieval-Augmented Generation (RAG)

---

## Tools

- Git
- GitHub
- Postman
- VS Code

---

# 🏗 Project Structure

```
cerebro_project/
│
├── cerebro_backend/
│   │
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── cerebro_frontend/
│   │
│   ├── public/
│   │   └── logo.png
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── eslint.config.js
│   └── README.md
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

# ⚙️ Working Flow

```
               Upload PDF
                    │
                    ▼
         Extract Text from PDF
                    │
                    ▼
             Split into Chunks
                    │
                    ▼
         Generate Vector Embeddings
                    │
                    ▼
         Store in MongoDB Atlas
                    │
                    ▼
            User asks Question
                    │
                    ▼
      Convert Question into Vector
                    │
                    ▼
      Perform Semantic Similarity Search
                    │
                    ▼
      Retrieve Relevant Document Chunks
                    │
                    ▼
      Send Context + Question to Groq LLM
                    │
                    ▼
         Generate Context-Aware Answer
                    │
                    ▼
           Display Answer to User
```

---

# 🚀 Installation

Clone Repository

```bash
git clone https://github.com/yogita-create/cerebro_project.git
```

Backend

```bash
cd cerebro_backend
npm install
npm start
```

Frontend

```bash
cd cerebro_frontend
npm install
npm run dev
```

---

# 🔑 Environment Variables

Create `.env` inside **cerebro_backend**

```env
PORT=5000

MONGODB_URI=YOUR_MONGODB_CONNECTION

GROQ_API_KEY=YOUR_GROQ_API_KEY
```

---

# 🌐 Working URL

https://cerebro-project.vercel.app/

---

# 📚 Learning Outcomes

This project helped me gain practical experience in

- Retrieval-Augmented Generation (RAG)
- React.js Development
- REST API Development
- MongoDB Atlas
- PDF Parsing
- Semantic Search
- Prompt Engineering
- Large Language Model Integration
- Vector Embeddings
- Full Stack Development

---

# 🚀 Future Improvements

- User Authentication
- Conversation Memory
- Multiple PDF Support
- OCR for Scanned PDFs
- Streaming Responses
- Document Management
- Citation-based Answers
- DOCX Support
- Dark Mode
- Admin Dashboard

---

# 👩‍💻 Author

**Yogita Sawant**

Web Developer | Frontend Developer

📧 Email: your-email@example.com

💼 LinkedIn: https://linkedin.com/in/your-profile

🌐 Portfolio: Coming Soon

---

<div align="center">

### ⭐ If you found this project useful, please give it a Star!

Made with ❤️ using React, Node.js, MongoDB & AI

</div>
