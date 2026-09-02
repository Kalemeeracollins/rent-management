import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  loginController,
  meController,
  logoutController,
  listUsers,
  createUser,
  updateUser,
  dashboard,
  listTenants,
  getTenant,
  createTenant,
  updateTenant,
  archiveTenant,
  listBuildings,
  getBuilding,
  createBuilding,
  updateBuilding,
  archiveBuilding,
  listFloors,
  getFloor,
  createFloor,
  updateFloor,
  deleteFloor,
  listUnits,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit,
  listLeases,
  getLease,
  createLease,
  updateLease,
  deleteLease,
  renewLease,
  terminateLease,
  listPayments,
  getPayment,
  createPayment,
  paymentReceipt,
  listMaintenance,
  getMaintenance,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  arrears,
  auditLogs,
  report,
} from "../controllers/api.controller.js";
import {
  loginSchema,
  paginationSchema,
  tenantSchema,
  tenantPatchSchema,
  buildingSchema,
  buildingPatchSchema,
  leaseSchema,
  leasePatchSchema,
  paymentSchema,
  maintenanceSchema,
  maintenanceUpdateSchema,
  idSchema,
  floorSchema,
  floorPatchSchema,
  unitSchema,
  unitPatchSchema,
  listFilterSchema,
  userSchema,
  userPatchSchema,
} from "../validators/schemas.js";

export const apiRouter = Router();
const ownerManagement = authorize("OWNER", "ADMIN");
const operations = authorize("OWNER", "ADMIN", "STAFF");
apiRouter.post("/auth/login", validate(loginSchema), loginController);
apiRouter.use(authenticate);
apiRouter.post("/auth/logout", logoutController);
apiRouter.get("/auth/me", meController);
apiRouter.get("/users", authorize("OWNER"), listUsers);
apiRouter.post("/users", authorize("OWNER"), validate(userSchema), createUser);
apiRouter.patch(
  "/users/:id",
  authorize("OWNER"),
  validate(userPatchSchema),
  updateUser,
);
apiRouter.get("/dashboard", dashboard);
apiRouter.get("/tenants", validate(paginationSchema), listTenants);
apiRouter.post("/tenants", operations, validate(tenantSchema), createTenant);
apiRouter.get("/tenants/:id", validate(idSchema), getTenant);
apiRouter.patch(
  "/tenants/:id",
  operations,
  validate(tenantPatchSchema),
  updateTenant,
);
apiRouter.delete(
  "/tenants/:id",
  ownerManagement,
  validate(idSchema),
  archiveTenant,
);
apiRouter.get("/buildings", validate(paginationSchema), listBuildings);
apiRouter.post(
  "/buildings",
  ownerManagement,
  validate(buildingSchema),
  createBuilding,
);
apiRouter.get("/buildings/:id", validate(idSchema), getBuilding);
apiRouter.patch(
  "/buildings/:id",
  ownerManagement,
  validate(buildingPatchSchema),
  updateBuilding,
);
apiRouter.delete(
  "/buildings/:id",
  ownerManagement,
  validate(idSchema),
  archiveBuilding,
);
apiRouter.get("/floors", validate(listFilterSchema), listFloors);
apiRouter.post("/floors", ownerManagement, validate(floorSchema), createFloor);
apiRouter.get("/floors/:id", validate(idSchema), getFloor);
apiRouter.patch(
  "/floors/:id",
  ownerManagement,
  validate(floorPatchSchema),
  updateFloor,
);
apiRouter.delete(
  "/floors/:id",
  ownerManagement,
  validate(idSchema),
  deleteFloor,
);
apiRouter.get("/units", validate(listFilterSchema), listUnits);
apiRouter.post("/units", ownerManagement, validate(unitSchema), createUnit);
apiRouter.get("/units/:id", validate(idSchema), getUnit);
apiRouter.patch(
  "/units/:id",
  ownerManagement,
  validate(unitPatchSchema),
  updateUnit,
);
apiRouter.delete("/units/:id", ownerManagement, validate(idSchema), deleteUnit);
apiRouter.get("/leases", listLeases);
apiRouter.post("/leases", ownerManagement, validate(leaseSchema), createLease);
apiRouter.get("/leases/:id", validate(idSchema), getLease);
apiRouter.patch(
  "/leases/:id",
  ownerManagement,
  validate(leasePatchSchema),
  updateLease,
);
apiRouter.delete(
  "/leases/:id",
  ownerManagement,
  validate(idSchema),
  deleteLease,
);
apiRouter.post(
  "/leases/:id/renew",
  ownerManagement,
  validate(idSchema),
  renewLease,
);
apiRouter.post(
  "/leases/:id/terminate",
  ownerManagement,
  validate(idSchema),
  terminateLease,
);
apiRouter.get("/payments", validate(listFilterSchema), listPayments);
apiRouter.get("/payments/:id", validate(idSchema), getPayment);
apiRouter.post(
  "/payments",
  authorize("OWNER", "ADMIN", "ACCOUNTANT"),
  validate(paymentSchema),
  createPayment,
);
apiRouter.get("/payments/:id/receipt", validate(idSchema), paymentReceipt);
apiRouter.get("/arrears", arrears);
apiRouter.get("/arrears/:tenantId", arrears);
apiRouter.get("/maintenance", validate(listFilterSchema), listMaintenance);
apiRouter.post(
  "/maintenance",
  operations,
  validate(maintenanceSchema),
  createMaintenance,
);
apiRouter.get("/maintenance/:id", validate(idSchema), getMaintenance);
apiRouter.patch(
  "/maintenance/:id",
  operations,
  validate(maintenanceUpdateSchema),
  updateMaintenance,
);
apiRouter.delete(
  "/maintenance/:id",
  ownerManagement,
  validate(idSchema),
  deleteMaintenance,
);
apiRouter.get("/audit-logs", authorize("OWNER", "ADMIN"), auditLogs);
apiRouter.get("/reports/rent", report);
apiRouter.get("/reports/payments", report);
apiRouter.get("/reports/occupancy", report);
apiRouter.get("/reports/arrears", arrears);
apiRouter.get("/reports/tenants", listTenants);
apiRouter.get("/reports/maintenance", listMaintenance);
