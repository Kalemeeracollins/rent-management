import { app } from "./app.js";
import { env } from "./config/env.js";

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
