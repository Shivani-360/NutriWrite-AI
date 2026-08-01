const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const requireAuth = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const { registerSchema, loginSchema, validate } = require("../validators/authValidators");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const isProd = process.env.NODE_ENV === "production";

// Sign a JWT for a given user id
const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Shared cookie options — httpOnly means JS on the frontend can never read this
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,           // only sent over HTTPS in production
  sameSite: isProd ? "none" : "lax", // "none" needed if frontend/backend are on different domains in prod
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days, matches JWT expiry
  path: "/",
};

const setAuthCookie = (res, token) => {
  res.cookie("token", token, COOKIE_OPTIONS);
};

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
    setAuthCookie(res, token);

    res.status(201).json({
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
    setAuthCookie(res, token);

    res.json({
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: "Failed to log in. Please try again." });
  }
});

// POST /api/auth/logout — clears the cookie server-side
router.post("/logout", (req, res) => {
  res.clearCookie("token", { ...COOKIE_OPTIONS, maxAge: undefined });
  res.json({ message: "Logged out successfully" });
});

// GET /api/auth/github/callback — GitHub redirects here after consent
router.get("/github/callback", (req, res, next) => {
  passport.authenticate("github", { session: true }, (err, user, info) => {
    console.log("=== GitHub OAuth callback ===");
    console.log("err:", err);
    console.log("user:", user ? user._id : null);
    console.log("info:", info);

    if (err) {
      console.error("OAuth error:", err);
      return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }
    if (!user) {
      console.error("OAuth failed, no user. info:", info);
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
    setAuthCookie(res, token);
    // No token in the URL anymore — the cookie is already set, just send them back
    res.redirect(`${FRONTEND_URL}/auth/callback`);
  }
);

module.exports = router;