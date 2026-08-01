const rateLimit = require("express-rate-limit");

// Max 5 attempts per 15 minutes per IP — applied to login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Please try again in 15 minutes." },
});

// Max 15 AI generations per 10 minutes per IP — Gemini calls cost real money,
// this is the endpoint most exposed to someone scripting requests.
const generateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "You're generating a lot right now — please wait a few minutes and try again." },
});

module.exports = { authLimiter, generateLimiter };