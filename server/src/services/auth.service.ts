import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../database/pool.js";
import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";
import { audit } from "./audit.service.js";
import type { Role } from "../types/roles.js";

export async function login(email: string, password: string, ip?: string) {
  const [rows] = await pool.execute(
    "SELECT id,name,email,password_hash,role,status FROM users WHERE email=? LIMIT 1",
    [email.toLowerCase()],
  );
  const user = (
    rows as Array<{
      id: number;
      name: string;
      email: string;
      password_hash: string;
      role: Role;
      status: string;
    }>
  )[0];
  if (
    !user ||
    user.status !== "ACTIVE" ||
    !(await bcrypt.compare(password, user.password_hash))
  ) {
    await audit(
      undefined,
      "LOGIN_FAILED",
      "AUTH",
      undefined,
      "Failed login attempt",
      ip,
    );
    throw new AppError(401, "Invalid email or password");
  }
  await pool.execute("UPDATE users SET last_login=NOW() WHERE id=?", [user.id]);
  await audit(user.id, "LOGIN", "AUTH", user.id, "User logged in", ip);
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] },
  );
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}
