require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const { router: authRouter } = require("./user_authentication");

const app = express();

/* ALLOWED ORIGINS */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://cerebro-project-lxhhb532u-yogita-sawants-projects-5192e91a.vercel.app",
];

/* MIDDLEWARE */
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(passport.initialize());

/* ROUTES */
app.use("/api/auth", authRouter);
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Backend Running");
});

/* DATABASE */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Error:", err);
  });