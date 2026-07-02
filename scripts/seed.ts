// Seeds Supabase with the 72 channels from data/dr-tv-working-list.csv.
// Usage: npm run seed
//
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
// Idempotent — upserts on `slug`.

import { config } from "dotenv";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";
import { readChannelsSource } from "../lib/csv-channels";

config({ path: join(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

// Node 20 doesn't ship native WebSocket; polyfill via `ws` for Realtime init.
const supabase = createClient(url, key, {
  auth: { persistSession: false },
  realtime: { transport: ws as unknown as typeof WebSocket },
});

async function main() {
  const channels = readChannelsSource(process.cwd());
  console.log(`Parsed ${channels.length} channels from CSV. Upserting to Supabase…`);

  const { data, error } = await supabase
    .from("channels")
    .upsert(channels, { onConflict: "slug", ignoreDuplicates: false })
    .select("slug");

  if (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }

  console.log(`OK. ${data?.length ?? 0} rows upserted.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
