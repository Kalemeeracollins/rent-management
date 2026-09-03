import type { Role } from "../../types/roles.js";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  status: string;
};

export type AuthClaims = Pick<AuthUser, "id" | "name" | "email" | "role">;
