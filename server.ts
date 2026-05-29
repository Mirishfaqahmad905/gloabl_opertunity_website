import express from "express";
import path from "path";
import mongoose from "mongoose";
import { createServer as createViteServer } from "vite";
import { apiRouter } from "./server/routes";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Connect to DB if configured
  const mongoURI = process.env.MONGODB_URI;
  let dbConnected = false;
  if (!mongoURI) {
    console.warn("⚠️ MONGODB_URI is not defined in .env. Database will not connect.");
  } else {
    try {
      await mongoose.connect(mongoURI);
      console.log("✅ Connected to MongoDB");
      dbConnected = true;
    } catch (err) {
      console.error("❌ MongoDB connection error:", err);
    }
  }

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Fail fast middleware if DB is not connected
  app.use("/api", (req, res, next) => {
    if (!dbConnected && req.path !== "/health") {
      if (req.path.includes('/public/settings')) return res.json({});
      if (req.path.includes('/public/carousels') || req.path.includes('/public/ads') || req.path.includes('/public/scholarships') || req.path.includes('/public/blogs') || req.path.includes('/public/countries')) return res.json([]);
      return res.status(500).json({ error: "Database configuration missing. Please set MONGODB_URI environment variable." });
    }
    next();
  });

  // API Routes
  app.use("/api", apiRouter);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", dbConnected: mongoose.connection.readyState === 1 });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Auto setup admin trigger in dev logs
    console.log(`Open http://localhost:${PORT}/api/auth/setup to initialize default admin account.`);
  });
}

startServer();
