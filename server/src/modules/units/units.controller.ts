import type { Request } from "express";
import { AppError } from "../../errors/AppError.js";
import { ok } from "../../utils/response.js";
import { asyncHandler } from "../../controllers/api.controller.js";
import * as service from "./units.service.js";
import { createLease } from "../leases/lease.service.js";

const id = (req: Request) => {
  const value = Number(req.params.id);
  if (!Number.isInteger(value) || value < 1)
    throw new AppError(400, "Invalid resource id");
  return value;
};
export const list = asyncHandler(async (req, res) =>
  ok(
    res,
    await service.listUnits(String(req.query.search ?? "")),
    "Rooms retrieved",
  ),
);
export const get = asyncHandler(async (req, res) =>
  ok(res, await service.getUnit(id(req)), "Room retrieved"),
);
export const create = asyncHandler(async (req, res) =>
  ok(
    res,
    await service.createUnit(req.body, req.user!.id, req.ip),
    "Room created successfully",
  ),
);
export const update = asyncHandler(async (req, res) =>
  ok(
    res,
    await service.updateUnit(id(req), req.body, req.user!.id, req.ip),
    "Room updated successfully",
  ),
);
export const remove = asyncHandler(async (req, res) =>
  ok(
    res,
    await service.deleteUnit(id(req), req.user!.id, req.ip),
    "Room deleted successfully",
  ),
);
export const assign = asyncHandler(async (req, res) =>
  ok(res, await createLease({ ...req.body, unit_id: id(req) }, req.user!.id, req.ip), "Room assigned successfully"),
);
