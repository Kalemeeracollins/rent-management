import { AppError } from "../../errors/AppError.js";
import { audit } from "../../services/audit.service.js";
import * as repository from "./units.repository.js";
import type { UnitInput, UnitPatch } from "./units.types.js";

export const listUnits = (search?: string) => repository.listUnits(search);
export async function getUnit(id: number) {
  const unit = await repository.findUnit(id);
  if (!unit) throw new AppError(404, "Unit not found");
  return unit;
}
export async function createUnit(
  input: UnitInput,
  actorId: number,
  ip?: string,
) {
  try {
    const id = await repository.insertUnit(input);
    await audit(actorId, "CREATE_UNIT", "UNIT", id, "Room created", ip);
    return { id };
  } catch (error) {
    if ((error as { code?: string }).code === "ER_DUP_ENTRY")
      throw new AppError(
        409,
        "This room number already exists in the building",
      );
    throw error;
  }
}
export async function updateUnit(
  id: number,
  input: UnitPatch,
  actorId: number,
  ip?: string,
) {
  if (!(await repository.updateUnit(id, input)))
    throw new AppError(404, "Unit not found or no fields to update");
  await audit(actorId, "UPDATE_UNIT", "UNIT", id, "Room updated", ip);
  return { id };
}
export async function deleteUnit(id: number, actorId: number, ip?: string) {
  if (await repository.countActiveLeases(id))
    throw new AppError(409, "A room with an active lease cannot be deleted");
  await repository.deleteUnit(id);
  await audit(actorId, "DELETE_UNIT", "UNIT", id, "Room deleted", ip);
  return { id };
}
