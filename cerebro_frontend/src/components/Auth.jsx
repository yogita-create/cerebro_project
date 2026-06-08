import React, { useState, useEffect, useRef } from "react";
import "./Auth.css";

const API = "https://cerebro-project-02f7.onrender.com";

/* ---------------- ICONS ---------------- */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const EyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosed = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const Auth = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      onAuthSuccess?.(token);
    }

    return () => (mounted.current = false);
  }, [onAuthSuccess]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => mounted.current && setToast(null), 3000);
  };

  const handleChange = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const endpoint =
        mode === "login"
          ? `${API}/api/auth/login`
          : `${API}/api/auth/register`;

      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : {
              name: form.name,
              email: form.email,
              password: form.password
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        onAuthSuccess?.(data.token);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      console.error("Auth Error:", error);
      showToast("Network Error", "error");
    }

    setLoading(false);
  };

  const handleGoogle = () => {
    window.open(`${API}/api/auth/google`, "_self");
  };

  return (
    <div className="auth-root mounted">

      {toast && (
        <div className={`auth-toast ${toast.type}`}>
          {toast.msg}
        </div>
      )}

      <div className="auth-shell">

        {/* LEFT BRAND PANEL (FIXED STRUCTURE) */}
        <div className="auth-brand">

          <div className="brand-glow-top" />
          <div className="brand-glow-bottom" />

          <div className="brand-content">

            <div className="brand-icon-wrap">
              <div className="brand-icon-ring" />
              <img
              src="\logo.png"
              alt="cerebro logo"
              className="brand-icon-img"
            />
            </div>

            <div>
              <div className="brand-wordmark"> CEREBRO</div>
              <div className="brand-tagline">
                RAG-powered PDF Intelligence
              </div>
            </div>
          </div>

          <div className="brand-features">
            <div className="brand-feature">
              <span className="feature-icon">📄</span>
              <span className="feature-text">Upload any PDF document</span>
            </div>
            <div className="brand-feature">
              <span className="feature-icon">💬</span>
              <span className="feature-text">Ask Questions related to your documents</span>
            </div>
            <div className="brand-feature">
              <span className="feature-icon">🧠</span>
              <span className="feature-text">AI-powered context Retrieval</span>
            </div>
          </div>

          <div className="brand-footer"></div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="auth-form-panel">

          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Sign In
            </button>
            
            <button
              className={`auth-tab ${mode === "signup" ? "active" : ""}`}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>

          <div className="auth-form-wrap">

            {mode === "signup" && (
              <input
                className="auth-input"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange("name")}
              />
            )}

            <input
              className="auth-input"
              placeholder="Email"
              value={form.email}
              onChange={handleChange("email")}
            />

            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange("password")}
              />
              <button className="eye-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeClosed /> : <EyeOpen />}
              </button>
            </div>

            {mode === "signup" && (
              <div className="auth-input-wrap">
                <input
                  className="auth-input"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={form.confirm}
                  onChange={handleChange("confirm")}
                />
                <button
                  className="eye-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
            )}

            <button
              className="auth-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
            
            <button className="auth-google-btn" onClick={handleGoogle}>
              <GoogleIcon />
              Continue with Google
            </button>
           {mode === "login" && (
          <div className="auth-info-text">
            <p>If you have an existing account,
            you can Sign in here</p>
          </div>
        )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;