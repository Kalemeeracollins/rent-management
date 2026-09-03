import type { Role } from "../../types/roles.js";

export type CreateUserInput = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: Role;
};

export type UpdateUserInput = Partial<
  Pick<CreateUserInput, "name" | "phone" | "role" | "password">
> & {
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};
