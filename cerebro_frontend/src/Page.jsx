import React, { useState, useEffect, useRef } from "react";
import "./Page.css";

const API = "http://localhost:5000/api";

const Page = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const toastTimer = useRef();

  /* ---------------- TOAST ---------------- */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });

    clearTimeout(toastTimer.current);

    toastTimer.current = setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    init();
    return () => clearTimeout(toastTimer.current);
  }, []);

  async function init() {
    const docs = await loadDocuments();

    const docId = localStorage.getItem("documentId");
    const sessId = localStorage.getItem("sessionId");

    if (docId && docs?.length) {
      const doc = docs.find((d) => d._id === docId);

      if (doc) {
        setSelectedDoc(doc);
        await loadSessions(docId);

        if (sessId) {
          setSessionId(sessId);
          await loadHistory(docId, sessId);
        }
      }
    }
  }

  /* ---------------- DOCUMENTS ---------------- */

  const loadDocuments = async () => {
    try {
      const res = await fetch(`${API}/documents`);
      const data = await res.json();

      if (data.success) {
        setDocuments(data.documents || []);
        return data.documents || [];
      }
    } catch {
      showToast("Backend disconnected", "error");
    }

    return [];
  };

  const selectDocument = async (docId) => {
    const doc = documents.find((d) => d._id === docId);

    if (!doc) return;

    setSelectedDoc(doc);
    localStorage.setItem("documentId", docId);

    setSessionId(null);
    setChatHistory([]);

    await loadSessions(docId);
  };

  const deleteDocument = async (id) => {
    try {
      await fetch(`${API}/documents/${id}`, {
        method: "DELETE",
      });

      await loadDocuments();

      if (selectedDoc?._id === id) {
        setSelectedDoc(null);
        setChatHistory([]);
      }

      showToast("Document deleted");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  /* ---------------- SESSIONS ---------------- */

  const loadSessions = async (docId) => {
    try {
      const res = await fetch(`${API}/chat/sessions/${docId}`);
      const data = await res.json();

      if (data.success) {
        setSessions(data.sessions || []);
      }
    } catch {
      showToast("Session load failed", "error");
    }
  };

  const loadHistory = async (docId, sessId) => {
    try {
      const res = await fetch(`${API}/chat/session/${docId}/${sessId}`);
      const data = await res.json();

      if (data.success) {
        setChatHistory(data.chats || []);
      }
    } catch {
      showToast("History failed", "error");
    }
  };

  const selectSession = async (sessId) => {
    setSessionId(sessId);
    localStorage.setItem("sessionId", sessId);

    await loadHistory(selectedDoc._id, sessId);
  };

  const handleNewChat = () => {
    setSessionId(null);
    setChatHistory([]);
    localStorage.removeItem("sessionId");
  };
const deleteSession = async (id) => {
  try {
    const res = await fetch(`${API}/chat/session/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Delete request failed");
    }

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Delete failed");
    }

    // if deleted selected session
    if (sessionId === id) {
      setSessionId(null);
      setChatHistory([]);
      localStorage.removeItem("sessionId");
    }

    await loadSessions(selectedDoc._id);

    showToast("Session deleted");

  } catch (err) {
    console.error("DELETE SESSION ERROR:", err);
    showToast("Delete failed", "error");
  }
};

  /* ---------------- UPLOAD ---------------- */

  const uploadPDF = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API}/documents/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        showToast("Upload failed", "error");
        return;
      }

      await loadDocuments();
      await selectDocument(data.id);

      showToast("Uploaded");
    } catch {
      showToast("Upload failed", "error");
    }
  };

  /* ---------------- ASK ---------------- */
const askQuestion = async (text, replaceIndex = null) => {
  if (!text.trim() || !selectedDoc) return;

  setLoading(true);

  try {
    const res = await fetch(`${API}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: text,
        documentId: selectedDoc._id,
        sessionId,
      }),
    });

    const data = await res.json();

    if (data.sessionId) {
      setSessionId(data.sessionId);
      localStorage.setItem("sessionId", data.sessionId);
    }

    // Regenerate → replace same answer
    if (replaceIndex !== null) {
      setChatHistory((prev) =>
        prev.map((item, i) =>
          i === replaceIndex
            ? {
                ...item,
                answer: data.answer,
              }
            : item
        )
      );
    }

    // New question → add new chat
    else {
      setChatHistory((prev) => [
        ...prev,
        {
          question: text,
          answer: data.answer,
        },
      ]);
    }

    await loadSessions(selectedDoc._id);

  } catch {
    showToast("Error", "error");
  }

  setLoading(false);
};


const handleAskQuestion = async () => {
  if (!question.trim()) return;

  const temp = question;

  setQuestion("");

  await askQuestion(temp);
};
    

  /* ---------------- FIXED REGENERATE ---------------- */
  const regenerateAnswer = async (chat, index) => {
    setChatHistory((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, answer: "Regenerating..." }
          : item
      )
    );

    await askQuestion(chat.question, index);

    showToast("Regenerated");
  };

  /* ---------------- ACTIONS ---------------- */

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    showToast("Copied");
  };

  const handleDownload = (chat) => {
    const blob = new Blob(
      [`Q: ${chat.question}\n\nA: ${chat.answer}`],
      { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "answer.txt";
    a.click();

    URL.revokeObjectURL(url);

    showToast("Downloaded");
  };

  return (
    <div className="page-container">
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.msg}
        </div>
      )}
  

{sidebarOpen && (
  <div
    className="sidebar-overlay"
    onClick={() => setSidebarOpen(false)}
  />
)}
      <div className="main-content">

        {/* LEFT PANEL */}
          <div className={`left-panel ${sidebarOpen ? "open" : ""}`}>
            <button
      className="mobile-menu-btn"
      onClick={() => setSidebarOpen(!sidebarOpen)}
    >
      {sidebarOpen ? "✕" : "☰"}
    </button>
          <label className="upload-btn">
            Upload PDF
            <input
              hidden
              type="file"
              accept=".pdf"
              onChange={(e) => uploadPDF(e.target.files[0])}
            />
          </label>

          <h3>Documents</h3>

          <div className="sessions">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className={`session-item ${
                  selectedDoc?._id === doc._id ? "active" : ""
                }`}
              >
                <span onClick={() => selectDocument(doc._id)}>
                  {doc.fileName}
                </span>

                <button onClick={() => deleteDocument(doc._id)}>✕</button>
              </div>
            ))}
          </div>

          <button
            className="new-chat-btn"
            onClick={handleNewChat}
          >
            + New Chat
          </button>

          <h3>Sessions</h3>

          <div className="sessions">
            {sessions.map((s) => (
              <div
                key={s._id}
                className={`session-item ${
                  sessionId === s._id ? "active" : ""
                }`}
              >
                <span onClick={() => selectSession(s._id)}>
                  {s.firstQuestion}
                </span>
                
                <button onClick={() => deleteSession(s._id)}>✕</button>
              </div>
            ))}
          </div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
               <div className="logo-glow-top" />


          <div className="logo-content">

            <div className="brand-icon-wrap">
              <div className="brand-icon-ring" />
              <img
              src="\logo.png"
              alt="cerebro logo"
              className="brand-icon-img"
            />
            </div>
            </div>
             <div className="logo-wordmark"> CEREBRO</div>
              <div className="logo-tagline">
                RAG-powered PDF Intelligence
              </div>

          <div className="chat-container">
            {chatHistory.map((chat, i) => (
              <div key={i} className="chat-item">

                <div className="question-box">
                  <p>{chat.question}</p>
                </div>

                <div className="answer-box">
                  <div className="mini-actions">

                    <button onClick={() => handleCopy(chat.answer)}>📋</button>

                    <button onClick={() => handleDownload(chat)}>⬇️</button>

                    <button
                      onClick={() =>
                        regenerateAnswer(chat, i)
                      }
                    >
                      🔄
                    </button>

                  </div>

                  <div>{chat.answer}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bottom-input">
            <input
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              placeholder="Ask anything..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  e.preventDefault();
                  handleAskQuestion();
                }
              }}
            />

            <button
              onClick={handleAskQuestion}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Page;