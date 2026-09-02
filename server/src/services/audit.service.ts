import { pool } from "../database/pool.js";

export async function audit(
  userId: number | undefined,
  action: string,
  entityType: string,
  entityId: number | undefined,
  description: string,
  ipAddress?: string,
): Promise<void> {
  await pool.execute(
    "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, description, ip_address) VALUES (?, ?, ?, ?, ?, ?)",
    [
      userId ?? null,
      action,
      entityType,
      entityId ?? null,
      description,
      ipAddress ?? null,
    ],
  );
}
