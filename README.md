# Muto Buildings & City View Management

A full-stack building and tenant management demo branded for CK WEB TECH. The client is a responsive Next.js dashboard and the server is an Express REST API backed by MySQL.

## Start

1. Copy `.env.example` to `.env` and set database values.
2. Start MySQL. The API automatically creates the `building_management` database, applies pending migrations, and only then starts listening. You can also run `npm run migrate` in `server` manually.
3. Run `npm install && npm run seed` in `server` to provision the owner and fictional tenant leases.
4. Run `npm start` in `server`.
5. Run `npm install && npm run dev` in `client`.
6. Open `http://localhost:3000`; sign in with `demo.owner@example.com` / `DemoPassword123!`.
7. API health: `http://localhost:4000/api/health`.

The users page supports server-side filtering by `search`, `role`, and `status`, with pagination via `page` and `limit`. Rooms can be created from the Rooms & shops page and assigned atomically to active tenants through the room assignment API.

Docker: `docker compose up --build` starts MySQL, API, and client. Run `docker compose exec api npm run seed` once MySQL is ready.

## Demo

The client includes fictional fallback records for two properties, tenants, balances, maintenance, reports, receipts, and audit activity. The API seed creates the same owner account and relational tenant/lease records. This is a demo credential and must be changed before production use.

## Architecture

`client` presents the management workspace. `server` owns authentication, authorization, validation, SQL access, financial transactions, and audit logging. `database/schema.sql` defines normalized tables, DECIMAL money fields, foreign keys, and indexes.

## Verification

- Client: `cd client && npm run build`
- API syntax: `cd server && node --check index.js`
- Tests: `cd server && npm test`

See `server/docs/` and `docs/` for deployment, security, API, database, demo, and testing notes.
