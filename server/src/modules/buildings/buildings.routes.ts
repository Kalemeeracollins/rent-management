import { Router } from "express";
import { authorize } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
  archiveBuilding,
  createBuilding,
  getBuilding,
  listBuildings,
  updateBuilding,
} from "../../controllers/api.controller.js";
import {
  buildingPatchSchema,
  buildingSchema,
  idSchema,
  paginationSchema,
} from "../../validators/schemas.js";

export const buildingsRouter = Router();
const management = authorize("OWNER", "ADMIN");
buildingsRouter.get("/", validate(paginationSchema), listBuildings);
buildingsRouter.post("/", management, validate(buildingSchema), createBuilding);
buildingsRouter.get("/:id", validate(idSchema), getBuilding);
buildingsRouter.patch(
  "/:id",
  management,
  validate(buildingPatchSchema),
  updateBuilding,
);
buildingsRouter.delete("/:id", management, validate(idSchema), archiveBuilding);
