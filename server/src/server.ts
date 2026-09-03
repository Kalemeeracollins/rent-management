import { app } from "./app.js";
import { env } from "./config/env.js";
import { migrateDatabase } from "./database/migrate.js";
import { ensureDemoAccounts } from "./database/demo.js";

async function start() {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 10; attempt += 1) {
    try {
      await migrateDatabase();
      await ensureDemoAccounts();
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
      if (attempt === 10) throw error;
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  if (lastError) throw lastError;
  app.listen(env.port, () =>
    console.log(
      JSON.stringify({
        level: "info",
        message: "API started",
        port: env.port,
        environment: env.nodeEnv,
      }),
    ),
  );
}

start().catch((error) => {
  console.error(
    JSON.stringify({
      level: "error",
      message: "Database migration failed",
      error: error instanceof Error ? error.message : "Unknown error",
    }),
  );
  process.exitCode = 1;
});
