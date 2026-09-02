# Security

Passwords are bcrypt hashes and are never returned by the API. JWT authentication and role middleware protect business routes. Helmet, CORS, parameterized SQL, login rate limiting, validation, foreign keys, and audit logging are enabled in the API.

Use a long random `JWT_SECRET`, TLS in production, a least-privilege database user, encrypted backups, and secret-manager environment variables. Remove development defaults before deployment and review audit logs regularly.