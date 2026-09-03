import bcrypt from "bcryptjs";
import { AppError } from "../../errors/AppError.js";
import { audit } from "../../services/audit.service.js";
import {
  insertUser,
  listUsers as readUsers,
  updateUser as writeUser,
} from "./users.repository.js";
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
  return readUsers(filters);
}
export async function createUser(
  input: CreateUserInput,
  actorId: number,
  ip?: string,
) {
  if (input.role === "OWNER")
    throw new AppError(403, "Only an owner can create another owner");
  try {
    const id = await insertUser(input, await bcrypt.hash(input.password, 12));
    await audit(
      actorId,
      "CREATE_USER",
      "USER",
      id,
      `User ${input.email} created`,
      ip,
    );
    return { id };
  } catch (error) {
    if ((error as { code?: string }).code === "ER_DUP_ENTRY")
      throw new AppError(409, "A user with this email already exists");
    throw error;
  }
}
export async function updateUser(
  id: number,
  input: UpdateUserInput,
  actorId: number,
  ip?: string,
) {
  if (id === actorId && input.status && input.status !== "ACTIVE")
    throw new AppError(409, "You cannot deactivate your own account");
  if (input.role === "OWNER")
    throw new AppError(403, "Only an owner can assign the owner role");
  await writeUser(
    id,
    input,
    input.password ? await bcrypt.hash(input.password, 12) : undefined,
  );
  await audit(actorId, "UPDATE_USER", "USER", id, "User account updated", ip);
  return { id };
}
