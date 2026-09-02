# API

Base URL: `http://localhost:4000/api`. Responses use `{ success, message, data }`; errors use `{ success: false, message }`.

- `GET /health` checks application and MySQL connectivity.
- `POST /auth/login` accepts `{ email, password }` and returns a JWT.
- `GET /dashboard` returns live property, rent, and tenant aggregates. Requires Bearer token.
- `GET /tenants?search=` lists tenant balances. Requires Bearer token.
- `POST /tenants` creates a tenant for OWNER, ADMIN, MANAGER, or STAFF.
- `POST /payments` records a payment and audit entry transactionally for OWNER, ADMIN, MANAGER, or ACCOUNTANT.

Validation failures are 400, authentication failures 401, permission failures 403, duplicate references 409, and unexpected errors 500.
