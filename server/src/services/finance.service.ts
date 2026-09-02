import { pool } from "../database/pool.js";
import { AppError } from "../errors/AppError.js";

export async function recordPayment(
  input: {
    tenantId: number;
    unitId: number;
    leaseId: number;
    amount: number;
    paymentDate?: string;
    paymentMethod: string;
    transactionReference?: string;
    periodFrom?: string;
    periodTo?: string;
    notes?: string;
  },
  userId: number,
  ip?: string,
) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[lease]] = (await connection.execute(
      "SELECT tenant_id,unit_id,status FROM leases WHERE id=? FOR UPDATE",
      [input.leaseId],
    )) as [
      Array<{ tenant_id: number; unit_id: number; status: string }>,
      unknown,
    ];
    if (
      !lease ||
      lease.tenant_id !== input.tenantId ||
      lease.unit_id !== input.unitId ||
      lease.status !== "ACTIVE"
    )
      throw new AppError(422, "Tenant, unit, and active lease do not match");
    const [[tenant]] = (await connection.execute(
      "SELECT id FROM tenants WHERE id=? AND status='ACTIVE'",
      [input.tenantId],
    )) as [Array<{ id: number }>, unknown];
    const [[unit]] = (await connection.execute(
      "SELECT id FROM units WHERE id=?",
      [input.unitId],
    )) as [Array<{ id: number }>, unknown];
    if (!tenant || !unit) throw new AppError(404, "Tenant or unit not found");
    const receipt = `MBC-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}`;
    const [insert] = await connection.execute(
      "INSERT INTO payments (receipt_number,tenant_id,unit_id,lease_id,amount,payment_date,payment_method,transaction_reference,period_from,period_to,notes,recorded_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        receipt,
        input.tenantId,
        input.unitId,
        input.leaseId,
        input.amount,
        input.paymentDate ?? new Date(),
        input.paymentMethod,
        input.transactionReference ?? null,
        input.periodFrom ?? null,
        input.periodTo ?? null,
        input.notes ?? null,
        userId,
      ],
    );
    const paymentId = (insert as { insertId: number }).insertId;
    const [charges] = await connection.execute(
      "SELECT id,amount_due,amount_paid FROM rent_charges WHERE lease_id=? AND status IN ('UNPAID','PARTIALLY_PAID','OVERDUE') ORDER BY due_date,id FOR UPDATE",
      [input.leaseId],
    );
    let remaining = input.amount;
    for (const charge of charges as Array<{
      id: number;
      amount_due: number;
      amount_paid: number;
    }>) {
      if (remaining <= 0) break;
      const applied = Math.min(
        remaining,
        Number(charge.amount_due) - Number(charge.amount_paid),
      );
      const newPaid = Number(charge.amount_paid) + applied;
      await connection.execute(
        "UPDATE rent_charges SET amount_paid=?,status=CASE WHEN ?>=amount_due THEN 'PAID' WHEN due_date<CURDATE() THEN 'OVERDUE' ELSE 'PARTIALLY_PAID' END WHERE id=?",
        [newPaid, newPaid, charge.id],
      );
      remaining -= applied;
    }
    await connection.execute(
      "INSERT INTO audit_logs (user_id,action,entity_type,entity_id,description,ip_address) VALUES (?,?,?,?,?,?)",
      [
        userId,
        "RECORD_PAYMENT",
        "PAYMENT",
        paymentId,
        `Payment ${receipt} recorded`,
        ip ?? null,
      ],
    );
    await connection.commit();
    return {
      id: paymentId,
      receiptNumber: receipt,
      unappliedAmount: remaining,
    };
  } catch (error) {
    await connection.rollback();
    if ((error as { code?: string }).code === "ER_DUP_ENTRY")
      throw new AppError(409, "Transaction reference already exists");
    throw error;
  } finally {
    connection.release();
  }
}

export async function getReceipt(id: number) {
  const [rows] = await pool.execute(
    "SELECT p.id,p.receipt_number,p.payment_date,p.amount,p.payment_method,p.transaction_reference,p.period_from,p.period_to,t.full_name,t.business_name,u.unit_number,b.name AS building,usr.name AS recorded_by,COALESCE((SELECT SUM(rc.amount_due-rc.amount_paid) FROM rent_charges rc WHERE rc.tenant_id=p.tenant_id),0) AS remaining_balance FROM payments p JOIN tenants t ON t.id=p.tenant_id JOIN units u ON u.id=p.unit_id JOIN buildings b ON b.id=u.building_id JOIN users usr ON usr.id=p.recorded_by WHERE p.id=?",
    [id],
  );
  if (!(rows as unknown[]).length) throw new AppError(404, "Payment not found");
  return (rows as unknown[])[0];
}
