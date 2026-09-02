# Database

Schema is in `database/schema.sql`. Core relationships are buildings -> floors -> units; tenants -> leases -> units; leases -> payments and rent charges. Maintenance requests optionally reference buildings, units, tenants, and assigned users. Audit logs reference the acting user.

All monetary values use `DECIMAL(15,2)`. Important indexes cover tenant phone/number, unit identity, lease dates/status, payment date/tenant, building/unit, rent status, and audit time. Foreign keys prevent orphaned financial records.
