const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

/* ---------------- JWT ---------------- */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

/* ---------------- REGISTER ---------------- */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ---------------- LOGIN ---------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const match = await user.comparePassword(password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ---------------- GOOGLE LOGIN ---------------- */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

/* ---------------- GOOGLE CALLBACK ---------------- */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${FRONTEND_URL}?error=google_failed`,
  }),
  (req, res) => {
    const token = signToken(req.user._id);
    res.redirect(`${FRONTEND_URL}?token=${token}`);
  }
);

/* ---------------- ME ---------------- */
router.get("/me", async (req, res) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token",
      });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("ME ERROR:", err);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

module.exports = router;