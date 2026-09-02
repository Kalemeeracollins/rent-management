import bcrypt from "bcryptjs";
import { pool, closeDatabase } from "../src/database/pool.js";

const ownerPassword = process.env.DEMO_OWNER_PASSWORD ?? "DemoPassword123!";
const ownerEmail = process.env.DEMO_OWNER_EMAIL ?? "demo.owner@example.com";
const people = [["Amina Nankya", "Lake View Pharmacy", "0702 441 908"], ["Daniel Okello", "Okello & Sons Hardware", "0774 221 330"], ["Grace Atim", "Atim Advocates", "0751 009 182"], ["Isaac Kato", "Kato Mobile Money", "0783 700 112"], ["Sarah Namusoke", "Namu Fashion House", "0708 881 426"], ["Peter Mugisha", "Mugisha Consulting", "0772 443 101"]];
async function main() {
const connection = await pool.getConnection();
try {
  await connection.beginTransaction();
  const hash = await bcrypt.hash(ownerPassword, 12);
  await connection.execute("INSERT INTO users(name,email,phone,password_hash,role,status) VALUES(?,?,?,?,'OWNER','ACTIVE') ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash),role='OWNER',status='ACTIVE'", ["Joseph Owino", ownerEmail, "0700 000 000", hash]);
  const [[owner]] = await connection.query("SELECT id FROM users WHERE email=?", [ownerEmail]) as unknown as [[{ id: number }], unknown];
  await connection.query("INSERT IGNORE INTO buildings(name,location,description) VALUES ('Muto Buildings','Plot 18, Kampala Road, Masaka','Main commercial building'),('City View','Elgin Street, Masaka','City View commercial centre')");
  const [buildingRows] = await connection.query("SELECT id,name FROM buildings") as unknown as [Array<{ id: number; name: string }>, unknown];
  for (const building of buildingRows) await connection.execute("INSERT IGNORE INTO floors(building_id,name,floor_number) VALUES (?, 'Ground Floor', 0), (?, 'First Floor', 1)", [building.id, building.id]);
  const unitNames = [["Muto Buildings", "Shop A01", 850000], ["Muto Buildings", "Shop A02", 600000], ["Muto Buildings", "Office B01", 1200000], ["Muto Buildings", "Office B02", 900000], ["City View", "Shop C01", 450000], ["City View", "Shop C02", 700000], ["City View", "Office D01", 950000], ["City View", "Shop D02", 500000]] as const;
  for (const [buildingName, number, rent] of unitNames) { const [[building]] = await connection.query("SELECT id FROM buildings WHERE name=?", [buildingName]) as unknown as [[{ id: number }], unknown]; await connection.execute("INSERT IGNORE INTO units(building_id,unit_number,unit_type,monthly_rent,status) VALUES(?,?,?,?, 'OCCUPIED')", [building.id, number, number.startsWith("Office") ? "OFFICE" : "SHOP", rent]); }
  const [units] = await connection.query("SELECT id,monthly_rent FROM units ORDER BY id LIMIT 8") as unknown as [Array<{ id: number; monthly_rent: number }>, unknown];
  for (let index = 0; index < people.length; index += 1) { const [name, business, phone] = people[index]; const tenantNumber = `TEN-DEMO-${index + 1}`; await connection.execute("INSERT INTO tenants(tenant_number,full_name,business_name,phone,status) VALUES(?,?,?,?, 'ACTIVE') ON DUPLICATE KEY UPDATE full_name=VALUES(full_name),business_name=VALUES(business_name)", [tenantNumber, name, business, phone]); const [[tenant]] = await connection.query("SELECT id FROM tenants WHERE tenant_number=?", [tenantNumber]) as unknown as [[{ id: number }], unknown]; const unit = units[index]; await connection.execute("INSERT IGNORE INTO leases(tenant_id,unit_id,start_date,end_date,monthly_rent,status,payment_due_day) VALUES(?,?, '2026-01-01','2026-12-31',?,'ACTIVE',5)", [tenant.id, unit.id, unit.monthly_rent]); const [[lease]] = await connection.query("SELECT id FROM leases WHERE tenant_id=? AND unit_id=? AND status='ACTIVE'", [tenant.id, unit.id]) as unknown as [[{ id: number }], unknown]; for (let month = 1; month <= 3; month += 1) await connection.execute("INSERT IGNORE INTO rent_charges(tenant_id,unit_id,lease_id,billing_period,amount_due,due_date,status) VALUES(?,?,?,?,?,DATE_ADD('2026-01-05',INTERVAL ? MONTH),'UNPAID')", [tenant.id, unit.id, lease.id, `2026-${String(month).padStart(2, "0")}`, unit.monthly_rent, month - 1]); }
  const [activeLeases] = await connection.query("SELECT id,tenant_id,unit_id,monthly_rent FROM leases WHERE status='ACTIVE' ORDER BY id LIMIT 6") as unknown as [Array<{ id: number; tenant_id: number; unit_id: number; monthly_rent: number }>, unknown];
  for (let index = 0; index < activeLeases.length; index += 1) { const lease = activeLeases[index]; if (index % 2 === 0) await connection.execute("INSERT IGNORE INTO payments(receipt_number,tenant_id,unit_id,lease_id,amount,payment_date,payment_method,period_from,period_to,recorded_by) VALUES(?,?,?,?,?,'2026-08-05','MOBILE_MONEY','2026-08-01','2026-08-31',?)", [`MBC-DEMO-${index + 1}`, lease.tenant_id, lease.unit_id, lease.id, Math.floor(Number(lease.monthly_rent) / 2), owner.id]); }
  const [[muto]] = await connection.query("SELECT id FROM buildings WHERE name='Muto Buildings'") as unknown as [[{ id: number }], unknown];
  const [[city]] = await connection.query("SELECT id FROM buildings WHERE name='City View'") as unknown as [[{ id: number }], unknown];
  await connection.execute("INSERT IGNORE INTO maintenance_requests(request_number,building_id,title,description,priority,status,estimated_cost) VALUES('MR-DEMO-001',?,'Leaking tap in washroom','Water leak reported by tenant','URGENT','IN_PROGRESS',150000),('MR-DEMO-002',?,'Replace front security light','Light needs replacement','MEDIUM','OPEN',90000)", [city.id, muto.id]);
  await connection.execute("INSERT INTO audit_logs(user_id,action,entity_type,description) VALUES(?, 'SEED_COMPLETED','SYSTEM','Demo data provisioned')", [owner.id]);
  await connection.commit(); console.log(`Seed complete. Login: ${ownerEmail} / ${ownerPassword}`);
} catch (error) { await connection.rollback(); throw error; } finally { connection.release(); await closeDatabase(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
