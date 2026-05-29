import mongoose from "mongoose";
import express from "express";
import { apiRouter } from "../server/routes";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Enhance CORS for Vercel
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase(uri: string) {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log("Connected to MongoDB in serverless function");
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Middleware to connect to DB before handling requests
app.use(async (req, res, next) => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI is missing.");
    if (req.path.includes('/settings')) return res.json({});
    if (req.path.includes('/carousels') || req.path.includes('/ads') || req.path.includes('/scholarships') || req.path.includes('/blogs') || req.path.includes('/countries')) return res.json([]);
    return res.status(500).json({ error: "Database configuration missing. Please set MONGODB_URI environment variable in your Vercel settings." });
  }

  try {
    await connectToDatabase(uri);
    next();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    if (req.path.includes('/settings')) return res.json({});
    if (req.path.includes('/carousels') || req.path.includes('/ads') || req.path.includes('/scholarships') || req.path.includes('/blogs') || req.path.includes('/countries')) return res.json([]);
    return res.status(500).json({ error: "Failed to connect to database. Make sure your IP is whitelisted in MongoDB Atlas (0.0.0.0/0)." });
  }
});

// Setup API Routes
// Mount on both /api and / in case Vercel rewrites strip the /api prefix
app.use("/api", apiRouter);
app.use("/", apiRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", dbConnected: mongoose.connection.readyState === 1, serverless: true });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", dbConnected: mongoose.connection.readyState === 1, serverless: true });
});

export default app;
