import { z } from "zod";

const id = z.coerce.number().int().positive();
const money = z.coerce.number().positive().finite();
const date = z.string().date();
export const loginSchema = z.object({
  body: z.object({ email: z.string().email(), password: z.string().min(8) }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
export const paginationSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().positive().optional(),
      limit: z.coerce.number().int().min(1).max(100).optional(),
      search: z.string().max(100).optional(),
    })
    .passthrough(),
  body: z.object({}).optional(),
  params: z.object({}).optional(),
});
export const tenantSchema = z.object({
  body: z.object({
    full_name: z.string().trim().min(2).max(150),
    business_name: z.string().trim().max(180).optional(),
    phone: z.string().trim().min(7).max(30),
    email: z.string().email().optional(),
    address: z.string().max(255).optional(),
    national_id_optional: z.string().max(80).optional(),
    emergency_contact: z.string().max(150).optional(),
    notes: z.string().max(2000).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
export const tenantPatchSchema = z.object({
  body: z
    .object({
      full_name: z.string().trim().min(2).max(150).optional(),
      business_name: z.string().trim().max(180).optional(),
      phone: z.string().trim().min(7).max(30).optional(),
      email: z.string().email().optional(),
      address: z.string().max(255).optional(),
      national_id_optional: z.string().max(80).optional(),
      emergency_contact: z.string().max(150).optional(),
      notes: z.string().max(2000).optional(),
      status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
    })
    .strict(),
  query: z.object({}).optional(),
  params: z.object({ id }).passthrough(),
});
export const buildingSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(150),
    location: z.string().trim().min(2).max(255),
    description: z.string().max(2000).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
export const buildingPatchSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(150).optional(),
      location: z.string().trim().min(2).max(255).optional(),
      description: z.string().max(2000).optional(),
    })
    .strict(),
  query: z.object({}).optional(),
  params: z.object({ id }).passthrough(),
});
export const leaseSchema = z.object({
  body: z.object({
    tenant_id: id,
    unit_id: id,
    start_date: date,
    end_date: date,
    monthly_rent: money,
    security_deposit: z.coerce.number().nonnegative().optional(),
    payment_due_day: z.coerce.number().int().min(1).max(28).optional(),
    notes: z.string().max(2000).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
export const paymentSchema = z.object({
  body: z.object({
    tenant_id: id,
    unit_id: id,
    lease_id: id,
    amount: money,
    payment_date: date.optional(),
    payment_method: z.enum(["CASH", "MOBILE_MONEY", "BANK", "OTHER"]),
    transaction_reference: z.string().max(120).optional(),
    period_from: date.optional(),
    period_to: date.optional(),
    notes: z.string().max(2000).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
export const maintenanceSchema = z.object({
  body: z.object({
    building_id: id,
    unit_id: id.optional(),
    tenant_id: id.optional(),
    title: z.string().trim().min(3).max(180),
    description: z.string().max(2000).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    assigned_to: id.optional(),
    estimated_cost: z.coerce.number().nonnegative().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
export const maintenancePatchSchema = z.object({
  body: z
    .object({
      status: z
        .enum(["OPEN", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "CANCELLED"])
        .optional(),
      priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
      assigned_to: id.optional(),
      actual_cost: z.coerce.number().nonnegative().optional(),
    })
    .strict(),
  query: z.object({}).optional(),
  params: z.object({ id }).passthrough(),
});
export const idSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id }).passthrough(),
});
export const floorSchema = z.object({
  body: z.object({
    building_id: id,
    name: z.string().trim().min(1).max(100),
    floor_number: z.coerce.number().int(),
    description: z.string().max(2000).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
export const floorPatchSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).max(100).optional(),
      floor_number: z.coerce.number().int().optional(),
      description: z.string().max(2000).optional(),
    })
    .strict(),
  query: z.object({}).optional(),
  params: z.object({ id }).passthrough(),
});
export const unitSchema = z.object({
  body: z.object({
    building_id: id,
    floor_id: id.optional(),
    unit_number: z.string().trim().min(1).max(50),
    unit_type: z.enum(["SHOP", "OFFICE", "ROOM", "OTHER"]),
    name: z.string().max(120).optional(),
    description: z.string().max(2000).optional(),
    monthly_rent: z.coerce.number().nonnegative(),
    status: z
      .enum(["VACANT", "OCCUPIED", "RESERVED", "MAINTENANCE"])
      .optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
export const unitPatchSchema = z.object({
  body: z
    .object({
      floor_id: id.optional(),
      unit_number: z.string().trim().min(1).max(50).optional(),
      unit_type: z.enum(["SHOP", "OFFICE", "ROOM", "OTHER"]).optional(),
      name: z.string().max(120).optional(),
      description: z.string().max(2000).optional(),
      monthly_rent: z.coerce.number().nonnegative().optional(),
      status: z
        .enum(["VACANT", "OCCUPIED", "RESERVED", "MAINTENANCE"])
        .optional(),
    })
    .strict(),
  query: z.object({}).optional(),
  params: z.object({ id }).passthrough(),
});
export const leasePatchSchema = z.object({
  body: z
    .object({
      start_date: date.optional(),
      end_date: date.optional(),
      monthly_rent: money.optional(),
      security_deposit: z.coerce.number().nonnegative().optional(),
      payment_due_day: z.coerce.number().int().min(1).max(28).optional(),
      status: z
        .enum(["UPCOMING", "ACTIVE", "EXPIRED", "TERMINATED"])
        .optional(),
      notes: z.string().max(2000).optional(),
    })
    .strict(),
  query: z.object({}).optional(),
  params: z.object({ id }).passthrough(),
});
export const maintenanceUpdateSchema = z.object({
  body: z
    .object({
      status: z
        .enum(["OPEN", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "CANCELLED"])
        .optional(),
      priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
      assigned_to: id.optional(),
      estimated_cost: z.coerce.number().nonnegative().optional(),
      actual_cost: z.coerce.number().nonnegative().optional(),
    })
    .strict(),
  query: z.object({}).optional(),
  params: z.object({ id }).passthrough(),
});
export const listFilterSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().positive().optional(),
      limit: z.coerce.number().int().min(1).max(100).optional(),
      search: z.string().max(100).optional(),
      building_id: id.optional(),
      tenant_id: id.optional(),
      status: z.string().max(30).optional(),
      priority: z.string().max(30).optional(),
      payment_method: z.string().max(30).optional(),
      from: date.optional(),
      to: date.optional(),
    })
    .passthrough(),
  body: z.object({}).optional(),
  params: z.object({}).optional(),
});
export const userSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().email(),
    phone: z.string().max(30).optional(),
    password: z.string().min(8),
    role: z.enum(["OWNER", "ADMIN", "ACCOUNTANT", "STAFF"]),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
export const userPatchSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(120).optional(),
      phone: z.string().max(30).optional(),
      role: z.enum(["OWNER", "ADMIN", "ACCOUNTANT", "STAFF"]).optional(),
      status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
      password: z.string().min(8).optional(),
    })
    .strict(),
  query: z.object({}).optional(),
  params: z.object({ id }).passthrough(),
});
