import { Router } from "express";
import { authorize } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
  createFloor,
  deleteFloor,
  getFloor,
  listFloors,
  updateFloor,
} from "../../controllers/api.controller.js";
import {
  floorPatchSchema,
  floorSchema,
  idSchema,
  listFilterSchema,
} from "../../validators/schemas.js";

export const floorsRouter = Router();
const management = authorize("OWNER", "ADMIN");
floorsRouter.get("/", validate(listFilterSchema), listFloors);
floorsRouter.post("/", management, validate(floorSchema), createFloor);
floorsRouter.get("/:id", validate(idSchema), getFloor);
floorsRouter.patch("/:id", management, validate(floorPatchSchema), updateFloor);
floorsRouter.delete("/:id", management, validate(idSchema), deleteFloor);
