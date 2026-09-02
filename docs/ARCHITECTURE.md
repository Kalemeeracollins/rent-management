# Architecture

The browser client uses Next.js, React, TypeScript and CSS modules/global design tokens. The Express API provides JSON REST resources and keeps business rules at the API/database boundary. MySQL stores normalized property, lease, tenant, payment, maintenance, notification, document, and audit data.

Authentication uses bcrypt password hashes and short-lived JWTs. Authorization is enforced in API middleware by role. Payment writes use a MySQL transaction: validate, insert payment, insert audit entry, then commit. SQL parameters are never concatenated.

Production flow: HTTPS frontend -> API service -> private MySQL -> separate backup storage.
