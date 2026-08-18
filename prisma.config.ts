import "dotenv/config";
import { defineConfig } from "prisma/config";

function getDatabaseUrl(): string {
  const url =
    process.env.DATABASE_URL ??
    process.env.DATABASE_PRIVATE_URL ??
    process.env.POSTGRES_URL;

  if (!url) {
    throw new Error(
      [
        "DATABASE_URL is not set.",
        "Railway: PostgreSQL を追加し、Web サービスの Variables に",
        "DATABASE_URL=${{Postgres.DATABASE_URL}} を設定してください。",
      ].join(" "),
    );
  }

  return url;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
