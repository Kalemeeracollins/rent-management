import { migrateDatabase } from "../src/database/migrate.js";

async function main() {
	await migrateDatabase();
	console.log(JSON.stringify({ level: "info", message: "Database migration complete" }));
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
