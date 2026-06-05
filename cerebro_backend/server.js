require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const { router: authRouter } = require("./user_authentication");

const app = express();

/* LOAD GOOGLE AUTH */


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());

/* ROUTES */
app.use("/api/auth", authRouter);
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/chat", require("./routes/chatRoutes")); // if exists

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Backend Running ");
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