import mongoose from "mongoose";
import express from "express";
import { apiRouter } from "../server/routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

let isConnected = false;
const mongoURI = process.env.MONGODB_URI;

// Middleware to connect to DB before handling requests
app.use(async (req, res, next) => {
  if (!mongoURI) {
    console.error("MONGODB_URI is missing.");
    if (req.path.includes('/public/settings')) return res.json({});
    if (req.path.includes('/public/carousels') || req.path.includes('/public/ads') || req.path.includes('/public/scholarships') || req.path.includes('/public/blogs') || req.path.includes('/public/countries')) return res.json([]);
    return res.status(500).json({ error: "Database configuration missing. Please set MONGODB_URI environment variable in your Vercel settings." });
  }

  if (!isConnected) {
    try {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000
      });
      isConnected = mongoose.connection.readyState === 1;
      console.log("Connected to MongoDB in serverless function");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      if (req.path.includes('/public/settings')) return res.json({});
      if (req.path.includes('/public/carousels') || req.path.includes('/public/ads') || req.path.includes('/public/scholarships') || req.path.includes('/public/blogs') || req.path.includes('/public/countries')) return res.json([]);
      return res.status(500).json({ error: "Failed to connect to database." });
    }
  }
  next();
});

// Setup API Routes
app.use("/api", apiRouter);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", dbConnected: mongoose.connection.readyState === 1, serverless: true });
});

export default app;
