import mysql from "mysql2/promise";
import { env } from "../config/env.js";

export const pool = mysql.createPool({
  host: env.databaseHost,
  port: env.databasePort,
  database: env.databaseName,
  user: env.databaseUser,
  password: env.databasePassword,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 1500,
  decimalNumbers: true
});

export const closeDatabase = () => pool.end();
