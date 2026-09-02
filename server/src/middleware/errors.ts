import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

export const notFound: RequestHandler = (_req, res) => res.status(404).json({ success: false, message: "Resource not found", data: null, errors: [] });
export const errorHandler: ErrorRequestHandler = (error, _req, res, _unusedNext) => {
  void _unusedNext;
  if (error instanceof ZodError) return res.status(400).json({ success: false, message: "Validation failed", data: null, errors: error.issues });
  if (error instanceof AppError) return res.status(error.statusCode).json({ success: false, message: error.message, data: null, errors: error.errors });
  console.error(JSON.stringify({ level: "error", message: error instanceof Error ? error.message : "Unknown error" }));
  return res.status(500).json({ success: false, message: "Something went wrong. Please try again.", data: null, errors: [] });
};
