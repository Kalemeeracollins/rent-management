import type { Request } from "express";
import { AppError } from "../../errors/AppError.js";
import { ok } from "../../utils/response.js";
import { pageMeta, pagination } from "../../utils/pagination.js";
import { asyncHandler } from "../../controllers/api.controller.js";
import * as service from "./users.service.js";

const id = (req: Request) => {
  const value = Number(req.params.id);
  if (!Number.isInteger(value) || value < 1)
    throw new AppError(400, "Invalid resource id");
  return value;
};
export const list = asyncHandler(async (req, res) => {
  const { page, limit } = pagination(
    req.query as { page?: string; limit?: string },
  );
  const result = await service.listUsers({ ...req.query, page, limit } as {
    search?: string;
    role?: string;
    status?: string;
    sort?: string;
    order?: string;
    page: number;
    limit: number;
  });
  ok(res, result.rows, "Users retrieved", pageMeta(page, limit, result.total));
});
export const create = asyncHandler(async (req, res) =>
  ok(
    res,
    await service.createUser(req.body, req.user!.id, req.ip),
    "User created successfully",
  ),
);
export const update = asyncHandler(async (req, res) =>
  ok(
    res,
    await service.updateUser(id(req), req.body, req.user!.id, req.ip),
    "User updated successfully",
  ),
);
