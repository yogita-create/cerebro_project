require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");

const app = express();

/* LOAD GOOGLE AUTH */
require("./user_authentication");

/* MIDDLEWARE */
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(passport.initialize());

/* ROUTES */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/chat", require("./routes/chatRoutes")); // if exists

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

/* DATABASE */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Error:", err);
  });