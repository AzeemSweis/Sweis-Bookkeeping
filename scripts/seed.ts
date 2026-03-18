#!/usr/bin/env tsx
/**
 * Database seeder for Sweis Bookkeeping.
 *
 * Reads schema.sql and seed.sql, executes them against the Vercel Postgres
 * database, then hashes ADMIN_PASSWORD and inserts the admin user.
 *
 * Usage:
 *   POSTGRES_URL=... ADMIN_USERNAME=admin ADMIN_PASSWORD=... npx tsx scripts/seed.ts
 */

import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";

function loadSql(filename: string): string {
  const filepath = path.join(process.cwd(), "src", "db", filename);
  return fs.readFileSync(filepath, "utf-8");
}

async function run(): Promise<void> {
  const requiredEnvVars = ["POSTGRES_URL", "ADMIN_USERNAME", "ADMIN_PASSWORD"];
  const missing = requiredEnvVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(
      `[seed] ERROR: Missing required environment variables: ${missing.join(", ")}`
    );
    process.exit(1);
  }

  const adminUsername = process.env.ADMIN_USERNAME!;
  const adminPassword = process.env.ADMIN_PASSWORD!;

  console.log(`[${new Date().toISOString()}] Starting database seed...`);

  // Run schema
  console.log(`[${new Date().toISOString()}] Applying schema.sql...`);
  const schema = loadSql("schema.sql");
  await sql.query(schema);
  console.log(`[${new Date().toISOString()}] schema.sql applied.`);

  // Run seed data
  console.log(`[${new Date().toISOString()}] Applying seed.sql...`);
  const seedData = loadSql("seed.sql");
  await sql.query(seedData);
  console.log(`[${new Date().toISOString()}] seed.sql applied.`);

  // Hash password and insert admin user
  console.log(`[${new Date().toISOString()}] Creating admin user '${adminUsername}'...`);
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

  await sql`
    INSERT INTO admin_users (username, password_hash)
    VALUES (${adminUsername}, ${passwordHash})
    ON CONFLICT (username) DO UPDATE
      SET password_hash = EXCLUDED.password_hash
  `;
  console.log(
    `[${new Date().toISOString()}] Admin user '${adminUsername}' created/updated.`
  );

  console.log(`[${new Date().toISOString()}] Seed complete.`);
}

run().catch((err: unknown) => {
  console.error(`[${new Date().toISOString()}] Seed failed:`, err);
  process.exit(1);
});
