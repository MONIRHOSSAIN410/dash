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
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const CLIENT_URL = (
  process.env.CLIENT_URL || "https://dash-b4jp.vercel.app/"
).replace(/\/+$/, "");
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/export", exportRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
await connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
