import mongoose from "mongoose";
import express from "express";
import { apiRouter } from "../server/routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

let cachedDb: typeof mongoose | null = null;

// Middleware to connect to DB before handling requests
app.use(async (req, res, next) => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI is missing.");
    if (req.path.includes('/public/settings')) return res.json({});
    if (req.path.includes('/public/carousels') || req.path.includes('/public/ads') || req.path.includes('/public/scholarships') || req.path.includes('/public/blogs') || req.path.includes('/public/countries')) return res.json([]);
    return res.status(500).json({ error: "Database configuration missing. Please set MONGODB_URI environment variable in your Vercel settings." });
  }

  if (cachedDb && mongoose.connection.readyState === 1) {
    return next();
  }

  try {
    if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
      cachedDb = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log("Connected to MongoDB in serverless function");
    }
    next();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    if (req.path.includes('/public/settings')) return res.json({});
    if (req.path.includes('/public/carousels') || req.path.includes('/public/ads') || req.path.includes('/public/scholarships') || req.path.includes('/public/blogs') || req.path.includes('/public/countries')) return res.json([]);
    return res.status(500).json({ error: "Failed to connect to database." });
  }
});

// Setup API Routes
app.use("/api", apiRouter);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", dbConnected: mongoose.connection.readyState === 1, serverless: true });
});

export default app;
