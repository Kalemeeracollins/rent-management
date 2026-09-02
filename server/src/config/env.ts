import "dotenv/config";

const required = (name: string, fallback?: string): string => {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  databaseHost: required("DATABASE_HOST", "127.0.0.1"),
  databasePort: Number(process.env.DATABASE_PORT ?? 3306),
  databaseName: required("DATABASE_NAME", "building_management"),
  databaseUser: required("DATABASE_USER", "root"),
  databasePassword: process.env.DATABASE_PASSWORD ?? "",
  jwtSecret: required("JWT_SECRET", "development-secret-change-me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  appVersion: process.env.APP_VERSION ?? "1.0.0",
} as const;
