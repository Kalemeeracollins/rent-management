import bcrypt from "bcryptjs";
import { pool } from "./pool.js";

const demoOwnerEmail = process.env.DEMO_OWNER_EMAIL ?? "demo.owner@example.com";
const demoOwnerPassword = process.env.DEMO_OWNER_PASSWORD ?? "DemoPassword123!";
const demoAdminEmail = process.env.DEMO_ADMIN_EMAIL ?? "demo.admin@example.com";
const demoAdminPassword = process.env.DEMO_ADMIN_PASSWORD ?? "AdminDemo123!";

export async function ensureDemoAccounts(): Promise<void> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const demoAccounts = [
      {
        name: "Joseph Owino",
        email: demoOwnerEmail,
        phone: "0700 000 000",
        password: demoOwnerPassword,
        role: "OWNER",
      },
      {
        name: "Demo Administrator",
        email: demoAdminEmail,
        phone: "0700 111 111",
        password: demoAdminPassword,
        role: "ADMIN",
      },
    ] as const;

    for (const account of demoAccounts) {
      const passwordHash = await bcrypt.hash(account.password, 12);
      await connection.execute(
        `INSERT INTO users (name, email, phone, password_hash, role, status)
         VALUES (?, ?, ?, ?, ?, 'ACTIVE')
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           phone = VALUES(phone),
           password_hash = VALUES(password_hash),
           role = VALUES(role),
           status = 'ACTIVE'`,
        [
          account.name,
          account.email,
          account.phone,
          passwordHash,
          account.role,
        ],
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
