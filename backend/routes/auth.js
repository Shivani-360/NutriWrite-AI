const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const requireAuth = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const { registerSchema, loginSchema, validate } = require("../validators/authValidators");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Sign a JWT for a given user id
const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
router.post("/register", authLimiter, validate(registerSchema), async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const user = await User.create({ email, password, name });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Failed to register. Please try again." });
  }
});

// POST /api/auth/login
router.post("/login", authLimiter, validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: "Failed to log in. Please try again." });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// GET /api/auth/me — returns the currently logged-in user
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ id: user._id, email: user.email, name: user.name, avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// --- GitHub OAuth ---

// GET /api/auth/github — kicks off the OAuth flow
router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: true }));

// GET /api/auth/github/callback — GitHub redirects here after consent
router.get("/github/callback", (req, res, next) => {
  passport.authenticate("github", { session: true }, (err, user, info) => {
    console.log("=== GitHub OAuth callback ===");
    console.log("err:", err);
    console.log("user:", user ? user._id : null);
    console.log("info:", info);

    if (err || !user) {
      console.error("OAuth failed:", err || info);
      return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error("req.logIn error:", loginErr);
        return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
      }
      const token = signToken(user._id);
      console.log("OAuth success, redirecting with token for user:", user._id);
      res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
    });
  })(req, res, next);
});

module.exports = router;