import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import mysql from "mysql2/promise";
import { env } from "../src/config/env.js";

async function main() {
	const sql = await readFile(resolve(process.cwd(), "migrations", "001_initial.sql"), "utf8");
	const statements = sql.split(";").map((part) => part.trim()).filter(Boolean);
	const connection = await mysql.createConnection({ host: env.databaseHost, port: env.databasePort, user: env.databaseUser, password: env.databasePassword, multipleStatements: false });
	try { for (const statement of statements) await connection.query(statement); console.log(JSON.stringify({ level: "info", message: "Database migration complete", statements: statements.length })); } finally { await connection.end(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
