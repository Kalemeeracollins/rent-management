import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";
import type { Role } from "../types/roles.js";

type Claims = { id: number; name: string; email: string; role: Role };
export const authenticate: RequestHandler = (req, _res, next) => {
  try {
    const value = req.header("authorization");
    if (!value?.startsWith("Bearer ")) throw new AppError(401, "Authentication required");
    req.user = jwt.verify(value.slice(7), env.jwtSecret) as Claims;
    next();
  } catch (error) { next(error instanceof AppError ? error : new AppError(401, "Invalid or expired token")); }
};
export const authorize = (...allowed: Role[]): RequestHandler => (req, _res, next) => {
  if (!req.user || !allowed.includes(req.user.role)) return next(new AppError(403, "You do not have permission for this action"));
  next();
};
