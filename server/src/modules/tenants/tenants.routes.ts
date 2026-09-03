import { Router } from "express";
import { authorize } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
  archiveTenant,
  createTenant,
  getTenant,
  listTenants,
  updateTenant,
} from "../../controllers/api.controller.js";
import {
  idSchema,
  paginationSchema,
  tenantPatchSchema,
  tenantSchema,
} from "../../validators/schemas.js";

export const tenantsRouter = Router();
const operations = authorize("OWNER", "ADMIN", "STAFF");
const management = authorize("OWNER", "ADMIN");
tenantsRouter.get("/", validate(paginationSchema), listTenants);
tenantsRouter.post("/", operations, validate(tenantSchema), createTenant);
tenantsRouter.get("/:id", validate(idSchema), getTenant);
tenantsRouter.patch(
  "/:id",
  operations,
  validate(tenantPatchSchema),
  updateTenant,
);
tenantsRouter.delete("/:id", management, validate(idSchema), archiveTenant);
