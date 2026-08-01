const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const session = require("express-session");
const connectDB = require("./config/db");

dotenv.config();

// Connect to MongoDB
connectDB();

const passport = require("./config/passport");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Middleware
app.use(helmet());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Session is only used to hold OAuth "state" during the GitHub handshake —
// all API auth after that is via an httpOnly JWT cookie.
app.use(
  session({
    secret: process.env.SESSION_SECRET || "nutriwrite-oauth-session",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 5 * 60 * 1000, // 5 minutes, just long enough for the OAuth redirect
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
const productRoutes = require("./routes/products");
const generateRoutes = require("./routes/generate");
const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/generate", generateRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "NutriWrite AI Backend is running 🚀" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});