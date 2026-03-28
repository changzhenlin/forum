import { execSync } from "node:child_process";
import process from "node:process";
import mysql from "mysql2/promise";

function parseDatabaseUrl() {
  const raw = process.env.DATABASE_URL;

  if (!raw) {
    throw new Error("DATABASE_URL is required.");
  }

  const url = new URL(raw);
  const database = url.pathname.replace(/^\//, "");

  if (!database) {
    throw new Error("DATABASE_URL must include a database name.");
  }

  return {
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database
  };
}

async function main() {
  const config = parseDatabaseUrl();
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    multipleStatements: true
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await connection.end();

  execSync("npx prisma migrate deploy", { stdio: "inherit" });
  execSync("npm run db:seed", { stdio: "inherit" });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
