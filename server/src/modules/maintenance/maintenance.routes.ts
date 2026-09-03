import { Router } from "express";
import { authorize } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
  createMaintenance,
  deleteMaintenance,
  getMaintenance,
  listMaintenance,
  updateMaintenance,
} from "../../controllers/api.controller.js";
import {
  idSchema,
  listFilterSchema,
  maintenanceSchema,
  maintenanceUpdateSchema,
} from "../../validators/schemas.js";

export const maintenanceRouter = Router();
const operations = authorize("OWNER", "ADMIN", "STAFF");
const management = authorize("OWNER", "ADMIN");
maintenanceRouter.get("/", validate(listFilterSchema), listMaintenance);
maintenanceRouter.post(
  "/",
  operations,
  validate(maintenanceSchema),
  createMaintenance,
);
maintenanceRouter.get("/:id", validate(idSchema), getMaintenance);
maintenanceRouter.patch(
  "/:id",
  operations,
  validate(maintenanceUpdateSchema),
  updateMaintenance,
);
maintenanceRouter.delete(
  "/:id",
  management,
  validate(idSchema),
  deleteMaintenance,
);
