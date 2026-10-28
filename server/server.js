import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";

import {
  notFound,
  errorHandler,
} from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Frontend URL
const CLIENT_URL = (
  process.env.CLIENT_URL || "https://dash-6h88.vercel.app/"
).replace(/\/+$/, "");

// CORS Configuration
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "API is running successfully",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/export", exportRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

try {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Allowed frontend origin: ${CLIENT_URL}`);
  });
} catch (error) {
  console.error("Failed to connect to database:", error);
  process.exit(1);
}