import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { authRouter } from "../modules/auth/auth.routes.js";
import { usersRouter } from "../modules/users/users.routes.js";
import { buildingsRouter } from "../modules/buildings/buildings.routes.js";
import { tenantsRouter } from "../modules/tenants/tenants.routes.js";
import { floorsRouter } from "../modules/floors/floors.routes.js";
import { unitsRouter } from "../modules/units/units.routes.js";
import { leasesRouter } from "../modules/leases/leases.routes.js";
import { paymentsRouter } from "../modules/payments/payments.routes.js";
import { maintenanceRouter } from "../modules/maintenance/maintenance.routes.js";
import {
  arrears,
  auditLogs,
  dashboard,
  listMaintenance,
  listTenants,
  report,
} from "../controllers/api.controller.js";
import { validate } from "../middleware/validate.js";
import { listFilterSchema, paginationSchema } from "../validators/schemas.js";

export const apiRouter = Router();
apiRouter.use("/auth", authRouter);
apiRouter.use(authenticate);
apiRouter.use("/users", usersRouter);
apiRouter.get("/dashboard", dashboard);
apiRouter.get("/dashboard/summary", dashboard);
apiRouter.get("/dashboard/rent", dashboard);
apiRouter.get("/dashboard/occupancy", dashboard);
apiRouter.get("/dashboard/recent-payments", dashboard);
apiRouter.get("/dashboard/arrears", dashboard);
apiRouter.use("/tenants", tenantsRouter);
apiRouter.use("/buildings", buildingsRouter);
apiRouter.use("/floors", floorsRouter);
apiRouter.use("/units", unitsRouter);
apiRouter.use("/leases", leasesRouter);
apiRouter.use("/payments", paymentsRouter);
apiRouter.get("/arrears", arrears);
apiRouter.get("/arrears/:tenantId", arrears);
apiRouter.use("/maintenance", maintenanceRouter);
apiRouter.get("/audit-logs", authorize("OWNER", "ADMIN"), auditLogs);
apiRouter.get("/reports/rent", report);
apiRouter.get("/reports/payments", report);
apiRouter.get("/reports/occupancy", report);
apiRouter.get("/reports/arrears", arrears);
apiRouter.get("/reports/tenants", validate(paginationSchema), listTenants);
apiRouter.get(
  "/reports/maintenance",
  validate(listFilterSchema),
  listMaintenance,
);
