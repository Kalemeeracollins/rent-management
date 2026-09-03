import { Router } from "express";
import { authorize } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
  createLease,
  deleteLease,
  getLease,
  listLeases,
  renewLease,
  terminateLease,
  updateLease,
} from "../../controllers/api.controller.js";
import {
  idSchema,
  leasePatchSchema,
  leaseRenewSchema,
  leaseSchema,
} from "../../validators/schemas.js";

export const leasesRouter = Router();
const management = authorize("OWNER", "ADMIN");
leasesRouter.get("/", listLeases);
leasesRouter.post("/", management, validate(leaseSchema), createLease);
leasesRouter.get("/:id", validate(idSchema), getLease);
leasesRouter.patch("/:id", management, validate(leasePatchSchema), updateLease);
leasesRouter.delete("/:id", management, validate(idSchema), deleteLease);
leasesRouter.post(
  "/:id/renew",
  management,
  validate(leaseRenewSchema),
  renewLease,
);
leasesRouter.post(
  "/:id/terminate",
  management,
  validate(idSchema),
  terminateLease,
);
