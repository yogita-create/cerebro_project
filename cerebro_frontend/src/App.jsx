import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Page from "./Page";

const API = "http://localhost:5000/api";

const App = () => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // VERIFY TOKEN
  const verifyToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setChecking(false);
      return;
    }

    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
    }

    setChecking(false);
  };

  useEffect(() => {
  void (async () => {
    await verifyToken();
  })();
}, []);

  // LOGIN SUCCESS
  const handleAuthSuccess = async (token) => {
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      }
    } catch {
      setUser({ name: "User" });
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  // LOADING
  if (checking) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#060D1A",
          color: "#06B6D4",
          fontSize: "18px",
        }}
      >
        Loading Cerebro...
      </div>
    );
  }

  // SHOW LOGIN
  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // SHOW APP
  return <Page user={user} onLogout={handleLogout} />;
};

export default App;