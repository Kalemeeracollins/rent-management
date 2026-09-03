import { Router } from "express";
import { authorize } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { create, list, update } from "./users.controller.js";
import {
  usersListSchema,
  userPatchSchema,
  userSchema,
} from "./users.validation.js";

export const usersRouter = Router();
usersRouter.use(authorize("OWNER", "ADMIN"));
usersRouter.get("/", validate(usersListSchema), list);
usersRouter.post("/", validate(userSchema), create);
usersRouter.patch("/:id", validate(userPatchSchema), update);
