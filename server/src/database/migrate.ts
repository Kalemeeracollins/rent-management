import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import mysql from "mysql2/promise";
import { env } from "../config/env.js";

const splitStatements = (sql: string) =>
  sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

export async function migrateDatabase(): Promise<void> {
  const connection = await mysql.createConnection({
    host: env.databaseHost,
    port: env.databasePort,
    user: env.databaseUser,
    password: env.databasePassword,
    multipleStatements: false,
  });
  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${env.databaseName.replaceAll("`", "")}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    await connection.query(`USE \`${env.databaseName.replaceAll("`", "")}\``);
    await connection.query(
      "CREATE TABLE IF NOT EXISTS schema_migrations (name VARCHAR(191) PRIMARY KEY, applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)",
    );
    const files = await readdir(resolve(process.cwd(), "migrations"), {
      withFileTypes: true,
    });
    const migrations = files
      .filter((file) => file.isFile() && file.name.endsWith(".sql"))
      .map((file) => file.name)
      .sort();
    for (const name of migrations) {
      const [applied] = await connection.execute(
        "SELECT name FROM schema_migrations WHERE name=?",
        [name],
      );
      if ((applied as Array<{ name: string }>).length) continue;
      await connection.beginTransaction();
      try {
        const sql = await readFile(
          resolve(process.cwd(), "migrations", name),
          "utf8",
        );
        for (const statement of splitStatements(
          sql
            .replace(/^CREATE DATABASE[^;]+;\s*/i, "")
            .replace(/^USE[^;]+;\s*/i, ""),
        ))
          await connection.query(statement);
        await connection.execute(
          "INSERT INTO schema_migrations (name) VALUES (?)",
          [name],
        );
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    }
  } finally {
    await connection.end();
  }
}
