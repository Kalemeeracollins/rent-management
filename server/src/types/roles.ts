export const roles = ["OWNER", "ADMIN", "ACCOUNTANT", "STAFF"] as const;
export type Role = (typeof roles)[number];
