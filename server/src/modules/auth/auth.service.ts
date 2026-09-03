import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../../errors/AppError.js";
import { audit } from "../../services/audit.service.js";
import { findUserByEmail, updateLastLogin } from "./auth.repository.js";
import type { AuthClaims } from "./auth.types.js";

export async function authenticateUser(
  email: string,
  password: string,
  ip?: string,
) {
  const user = await findUserByEmail(email);
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

  await updateLastLogin(user.id);
  await audit(user.id, "LOGIN", "AUTH", user.id, "User logged in", ip);
  const claims: AuthClaims = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  return {
    token: jwt.sign(claims, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
    }),
    user: claims,
  };
}
