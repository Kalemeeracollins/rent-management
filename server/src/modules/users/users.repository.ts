import { pool } from "../../database/pool.js";
import type { CreateUserInput, UpdateUserInput } from "./users.types.js";

export async function listUsers(filters: {
  search?: string;
  role?: string;
  status?: string;
  sort?: string;
  order?: string;
  page: number;
  limit: number;
}) {
  const conditions = ["1=1"];
  const values: Array<string | number> = [];
  if (filters.search) {
    conditions.push("(name LIKE ? OR email LIKE ? OR phone LIKE ?)");
    const value = `%${filters.search}%`;
    values.push(value, value, value);
  }
  if (filters.role) {
    conditions.push("role=?");
    values.push(filters.role);
  }
  if (filters.status) {
    conditions.push("status=?");
    values.push(filters.status);
  }
  const sort = ["name", "email", "role", "created_at", "last_login"].includes(
    filters.sort ?? "",
  )
    ? filters.sort
    : "name";
  const order = filters.order === "desc" ? "DESC" : "ASC";
  const [[count]] = (await pool.execute(
    `SELECT COUNT(*) AS total FROM users WHERE ${conditions.join(" AND ")}`,
    values,
  )) as unknown as [[{ total: number }], unknown];
  const [rows] = await pool.execute(
    `SELECT id,name,email,phone,role,status,last_login,created_at FROM users WHERE ${conditions.join(" AND ")} ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`,
    [...values, filters.limit, (filters.page - 1) * filters.limit],
  );
  return { rows, total: Number(count.total) };
}

export async function insertUser(input: CreateUserInput, passwordHash: string) {
  const [result] = await pool.execute(
    "INSERT INTO users(name,email,phone,password_hash,role,status) VALUES(?,?,?,?,?,'ACTIVE')",
    [
      input.name,
      input.email.toLowerCase(),
      input.phone ?? null,
      passwordHash,
      input.role,
    ],
  );
  return (result as { insertId: number }).insertId;
}

export async function updateUser(
  id: number,
  input: UpdateUserInput,
  passwordHash?: string,
) {
  const fields: string[] = [];
  const values: Array<string | number | null> = [];
  for (const field of ["name", "phone", "role", "status"] as const)
    if (input[field] !== undefined) {
      fields.push(`${field}=?`);
      values.push(input[field] ?? null);
    }
  if (passwordHash) {
    fields.push("password_hash=?");
    values.push(passwordHash);
  }
  await pool.execute(`UPDATE users SET ${fields.join(",")} WHERE id=?`, [
    ...values,
    id,
  ]);
}
