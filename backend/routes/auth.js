const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const requireAuth = require("../middleware/auth");
const authLimiter = require("../middleware/rateLimiter");
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

    // password has `select: false` on the schema, so opt back in
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
// JWTs are stateless, so there's nothing to invalidate server-side —
// this endpoint exists for a consistent API; the frontend clears the token.
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
router.get(
  "/github/callback",
  passport.authenticate("github", { session: true, failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed` }),
  (req, res) => {
    // req.user was set by the GitHub strategy's verify callback
    const token = signToken(req.user._id);
    // Hand the JWT to the frontend via a short-lived query param
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router;
