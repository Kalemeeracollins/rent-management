import { pool } from "../../database/pool.js";
import { AppError } from "../../errors/AppError.js";

type LeaseInput = {
  tenant_id: number;
  unit_id: number;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit?: number;
  payment_due_day?: number;
  notes?: string;
};

const insertId = (result: unknown) => (result as { insertId: number }).insertId;

export async function createLease(
  input: LeaseInput,
  userId: number,
  ip?: string,
) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[tenant]] = (await connection.execute(
      "SELECT id FROM tenants WHERE id=? AND status='ACTIVE' FOR UPDATE",
      [input.tenant_id],
    )) as unknown as [[{ id: number }?], unknown];
    const [[unit]] = (await connection.execute(
      "SELECT id,status FROM units WHERE id=? FOR UPDATE",
      [input.unit_id],
    )) as unknown as [[{ id: number; status: string }?], unknown];
    if (!tenant || !unit) throw new AppError(404, "Tenant or unit not found");
    if (unit.status === "MAINTENANCE")
      throw new AppError(409, "A unit under maintenance cannot be leased");
    const [[conflict]] = (await connection.execute(
      "SELECT id FROM leases WHERE unit_id=? AND status IN ('ACTIVE','UPCOMING') AND start_date<=? AND end_date>=? FOR UPDATE",
      [input.unit_id, input.end_date, input.start_date],
    )) as unknown as [[{ id: number }?], unknown];
    if (conflict)
      throw new AppError(409, "Unit already has an overlapping lease");
    const [result] = await connection.execute(
      "INSERT INTO leases(tenant_id,unit_id,start_date,end_date,monthly_rent,security_deposit,payment_due_day,status,notes) VALUES (?,?,?,?,?,?,?,'ACTIVE',?)",
      [
        input.tenant_id,
        input.unit_id,
        input.start_date,
        input.end_date,
        input.monthly_rent,
        input.security_deposit ?? 0,
        input.payment_due_day ?? 5,
        input.notes ?? null,
      ],
    );
    const id = insertId(result);
    await connection.execute("UPDATE units SET status='OCCUPIED' WHERE id=?", [
      input.unit_id,
    ]);
    await connection.execute(
      "INSERT INTO audit_logs (user_id,action,entity_type,entity_id,description,ip_address) VALUES (?,?,?,?,?,?)",
      [userId, "CREATE_LEASE", "LEASE", id, "Lease created", ip ?? null],
    );
    await connection.commit();
    return { id };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function terminateLease(id: number, userId: number, ip?: string) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      "UPDATE leases SET status='TERMINATED' WHERE id=? AND status NOT IN ('TERMINATED','EXPIRED')",
      [id],
    );
    if (!(result as { affectedRows: number }).affectedRows)
      throw new AppError(404, "Active lease not found");
    await connection.execute(
      "UPDATE units u JOIN leases l ON l.unit_id=u.id SET u.status='VACANT' WHERE l.id=? AND NOT EXISTS (SELECT 1 FROM leases other WHERE other.unit_id=u.id AND other.id<>l.id AND other.status IN ('ACTIVE','UPCOMING'))",
      [id],
    );
    await connection.execute(
      "INSERT INTO audit_logs (user_id,action,entity_type,entity_id,description,ip_address) VALUES (?,?,?,?,?,?)",
      [userId, "TERMINATE_LEASE", "LEASE", id, "Lease terminated", ip ?? null],
    );
    await connection.commit();
    return { id };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
