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
  if (mongoURI && !isConnected) {
    try {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000
      });
      isConnected = mongoose.connection.readyState === 1;
      console.log("Connected to MongoDB in serverless function");
    } catch (err) {
      console.error("MongoDB connection error:", err);
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
