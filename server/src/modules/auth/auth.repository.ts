import { pool } from "../../database/pool.js";
import type { AuthUser } from "./auth.types.js";

export async function findUserByEmail(
  email: string,
): Promise<AuthUser | undefined> {
  const [rows] = await pool.execute(
    "SELECT id,name,email,password_hash,role,status FROM users WHERE email=? LIMIT 1",
    [email.toLowerCase()],
  );
  return (rows as AuthUser[])[0];
}

export async function updateLastLogin(userId: number): Promise<void> {
  await pool.execute("UPDATE users SET last_login=NOW() WHERE id=?", [userId]);
}
