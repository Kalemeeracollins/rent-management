import { Router } from "express";
import { authorize } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
  createPayment,
  getPayment,
  listPayments,
  paymentReceipt,
} from "../../controllers/api.controller.js";
import {
  idSchema,
  listFilterSchema,
  paymentSchema,
} from "../../validators/schemas.js";

export const paymentsRouter = Router();
paymentsRouter.get("/", validate(listFilterSchema), listPayments);
paymentsRouter.get("/:id", validate(idSchema), getPayment);
paymentsRouter.post(
  "/",
  authorize("OWNER", "ADMIN", "ACCOUNTANT"),
  validate(paymentSchema),
  createPayment,
);
paymentsRouter.get("/:id/receipt", validate(idSchema), paymentReceipt);
