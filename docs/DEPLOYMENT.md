# Deployment

Deploy the Next client behind HTTPS and the Express API behind a private network or API gateway. Run MySQL on a managed private instance, provide secrets through the platform secret store, and restrict CORS to the deployed client origin. Build the client with `npm run build`, run the API with `npm start`, and expose only the API health endpoint publicly.

Back up MySQL daily to separate storage, retain daily backups for 30 days and monthly backups for 12 months, and test a restore at least quarterly. Keep the database and backup credentials separate from application credentials.