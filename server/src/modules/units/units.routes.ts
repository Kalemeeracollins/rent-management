import { Router } from "express";
import { authorize } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
  idSchema,
  listFilterSchema,
  unitPatchSchema,
  unitSchema,
  leaseAssignmentSchema,
} from "../../validators/schemas.js";
import { assign, create, get, list, remove, update } from "./units.controller.js";

export const unitsRouter = Router();
const management = authorize("OWNER", "ADMIN");
unitsRouter.get("/", validate(listFilterSchema), list);
unitsRouter.post("/", management, validate(unitSchema), create);
unitsRouter.post("/:id/assign", management, validate(leaseAssignmentSchema), assign);
unitsRouter.get("/:id", validate(idSchema), get);
unitsRouter.patch("/:id", management, validate(unitPatchSchema), update);
unitsRouter.delete("/:id", management, validate(idSchema), remove);
