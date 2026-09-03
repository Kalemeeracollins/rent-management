import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { apiRouter } from "./routes/api.routes.js";
import { pool } from "./database/pool.js";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errors.js";

export const app = express();
app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);
app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      success: true,
      status: "healthy",
      database: "connected",
      version: env.appVersion,
      environment: env.nodeEnv,
    });
  } catch {
    res.status(503).json({
      success: false,
      status: "unhealthy",
      database: "disconnected",
      data: null,
      errors: [],
    });
  }
});
app.use("/api", apiRouter);
app.use("/api/v1", apiRouter);
app.use(notFound);
app.use(errorHandler);
