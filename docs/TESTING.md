# Testing

Run `npm run build` in `client`, `node --check index.js` in `server`, and `npm test` in `server`. The current automated suite is a smoke-test placeholder and reports zero tests; critical authentication, authorization, tenant, lease, payment, rent calculation, and receipt cases should be added with a disposable MySQL test database before production release.