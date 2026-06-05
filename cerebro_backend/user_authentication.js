const express  = require("express");
const jwt       = require("jsonwebtoken");
const passport  = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User      = require("./models/User");

const router = express.Router();

/* ─────────────────────────────────
   HELPERS
───────────────────────────────── */
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const FRONTEND_URL = process.env.FRONTEND_URL || "cerebro-project-git-main-yogita-sawants-projects-5192e91a.vercel.app";

/* ─────────────────────────────────
   PASSPORT — Google Strategy
───────────────────────────────── */
passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  `${process.env.BACKEND_URL || "https://cerebro-project-02f7.onrender.com"}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email  = profile.emails?.[0]?.value;
        const name   = profile.displayName;
        const avatar = profile.photos?.[0]?.value;

        if (!email) return done(new Error("No email from Google"), null);

        // Find existing user or create new one
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name,
            email,
            googleId: profile.id,
            avatar,
          });
        } else if (!user.googleId) {
          // Existing email-password user — link Google
          user.googleId = profile.id;
          user.avatar   = user.avatar || avatar;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Required by Passport (not used for sessions — JWT only)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

/* ─────────────────────────────────
   MIDDLEWARE — protect routes
───────────────────────────────── */
const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

/* ─────────────────────────────────
   POST /api/auth/register
───────────────────────────────── */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    const user  = await User.create({ name, email, password });
    const token = signToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ─────────────────────────────────
   POST /api/auth/login
───────────────────────────────── */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = signToken(user._id);

    return res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ─────────────────────────────────
   GET /api/auth/google
───────────────────────────────── */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

/* ─────────────────────────────────
   GET /api/auth/google/callback
───────────────────────────────── */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${FRONTEND_URL}?error=google_failed`,
  }),
  (req, res) => {
    const token = signToken(req.user._id);
    // Redirect to frontend with JWT in query param
    res.redirect(`${FRONTEND_URL}?token=${token}`);
  }
);

/* ─────────────────────────────────
   GET /api/auth/me  (protected)
───────────────────────────────── */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -googleId");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = { router, protect };
