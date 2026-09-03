import { pool } from "../../database/pool.js";
import type { UnitInput, UnitPatch } from "./units.types.js";

export async function listUnits(search = "") {
  const value = `%${search}%`;
  const [rows] = await pool.execute(
    "SELECT u.*,b.name AS building,f.name AS floor,l.id AS lease_id,l.tenant_id,t.full_name AS tenant FROM units u JOIN buildings b ON b.id=u.building_id LEFT JOIN floors f ON f.id=u.floor_id LEFT JOIN leases l ON l.unit_id=u.id AND l.status='ACTIVE' LEFT JOIN tenants t ON t.id=l.tenant_id WHERE u.unit_number LIKE ? OR u.name LIKE ? ORDER BY u.unit_number",
    [value, value],
  );
  return rows;
}
export async function findUnit(id: number) {
  const [rows] = await pool.execute(
    "SELECT u.*,b.name AS building,f.name AS floor FROM units u JOIN buildings b ON b.id=u.building_id LEFT JOIN floors f ON f.id=u.floor_id WHERE u.id=?",
    [id],
  );
  return (rows as Record<string, unknown>[])[0];
}
export async function insertUnit(input: UnitInput) {
  const [result] = await pool.execute(
    "INSERT INTO units(building_id,floor_id,unit_number,unit_type,name,description,monthly_rent,status) VALUES(?,?,?,?,?,?,?,?)",
    [
      input.building_id,
      input.floor_id ?? null,
      input.unit_number,
      input.unit_type,
      input.name ?? null,
      input.description ?? null,
      input.monthly_rent,
      input.status ?? "VACANT",
    ],
  );
  return (result as { insertId: number }).insertId;
}
export async function updateUnit(id: number, input: UnitPatch) {
  const fields = Object.keys(input).filter((field) =>
    [
      "building_id",
      "floor_id",
      "unit_number",
      "unit_type",
      "name",
      "description",
      "monthly_rent",
      "status",
    ].includes(field),
  );
  if (!fields.length) return false;
  const values = fields.map((field) => input[field as keyof UnitPatch] ?? null);
  const [result] = await pool.execute(
    `UPDATE units SET ${fields.map((field) => `${field}=?`).join(",")} WHERE id=?`,
    [...values, id],
  );
  return Boolean((result as { affectedRows: number }).affectedRows);
}
export async function countActiveLeases(id: number) {
  const [[row]] = (await pool.execute(
    "SELECT COUNT(*) AS count FROM leases WHERE unit_id=? AND status IN ('ACTIVE','UPCOMING')",
    [id],
  )) as unknown as [[{ count: number }], unknown];
  return Number(row.count);
}
export async function deleteUnit(id: number) {
  await pool.execute("DELETE FROM units WHERE id=?", [id]);
}
