import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/auth.js";
import { login, logout, me } from "./auth.controller.js";
import { loginSchema } from "./auth.validation.js";

export const authRouter = Router();
authRouter.post("/login", validate(loginSchema), login);
authRouter.use(authenticate);
authRouter.post("/logout", logout);
authRouter.get("/me", me);
