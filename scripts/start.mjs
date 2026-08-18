import { execSync } from "node:child_process";

const dbUrl =
  process.env.DATABASE_URL ??
  process.env.DATABASE_PRIVATE_URL ??
  process.env.POSTGRES_URL;

if (!dbUrl) {
  console.error(`
ERROR: DATABASE_URL is not set.

Railway での設定手順:
1. プロジェクトに PostgreSQL を追加
2. Web サービス (Next.js) の Variables タブを開く
3. 以下を追加:
   DATABASE_URL = \${{Postgres.DATABASE_URL}}

   ※ Postgres は PostgreSQL サービスの名前。UI の Variable Reference から選ぶと確実です。
`);
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = dbUrl;
}

console.log("Running database migrations...");
execSync("npx prisma migrate deploy", { stdio: "inherit" });

console.log("Starting Next.js...");
execSync("npx next start", { stdio: "inherit" });
