import type { RequestHandler } from "express";
import { audit } from "../../services/audit.service.js";
import { ok } from "../../utils/response.js";
import { authenticateUser } from "./auth.service.js";

export const login: RequestHandler = async (req, res) => {
  ok(
    res,
    await authenticateUser(req.body.email, req.body.password, req.ip),
    "Login successful",
  );
};

export const me: RequestHandler = (req, res) => ok(res, req.user);

export const logout: RequestHandler = async (req, res) => {
  await audit(
    req.user?.id,
    "LOGOUT",
    "AUTH",
    req.user?.id,
    "User logged out",
    req.ip,
  );
  ok(res, null, "Logged out successfully");
};
