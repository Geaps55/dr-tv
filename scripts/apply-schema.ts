// One-shot: apply supabase/schema.sql directly to the Postgres database via
// the pooler connection. Fallback for when the Supabase dashboard SQL editor
// misbehaves. Run once, then delete or leave for re-provisioning scenarios.
//
// Reads DB password from DB_PASSWORD env var. Do NOT hardcode it here.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";
import { config } from "dotenv";

config({ path: join(process.cwd(), ".env.local") });

const password = process.env.DB_PASSWORD;
if (!password) {
  console.error("Missing DB_PASSWORD env var. Set it inline: DB_PASSWORD='...' npm run apply-schema");
  process.exit(1);
}

// Derive project ref from the Supabase URL so this script doesn't need a
// separate config value.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!url) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  process.exit(1);
}
const ref = new URL(url).host.split(".")[0];

const client = new Client({
  host: `db.${ref}.supabase.co`,
  port: 5432,
  user: "postgres",
  password,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const sqlPath = join(process.cwd(), "supabase", "schema.sql");
  const sql = readFileSync(sqlPath, "utf8");
  console.log(`Connecting to db.${ref}.supabase.co…`);
  await client.connect();
  console.log(`Applying ${sqlPath} (${sql.length} bytes)…`);
  await client.query(sql);
  const { rows } = await client.query(`
    select table_name from information_schema.tables
    where table_schema = 'public' order by table_name
  `);
  console.log(`✓ Schema applied. public tables: ${rows.map((r) => r.table_name).join(", ")}`);
  await client.end();
}

main().catch(async (err) => {
  console.error(err);
  try { await client.end(); } catch { /* ignore */ }
  process.exit(1);
});
