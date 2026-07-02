// One-time migration: applies hand-written copy from data/dr-tv-seo-copy.csv
// to an already-seeded Supabase `channels` table.
//
// Updates only these columns (leaves embed_source, embed_type, category,
// fallback_url, status, sort_order untouched):
//   - seo_title
//   - seo_description
//   - channel_description
//   - province
//   - featured
//
// Matching strategy: primary = slug, fallback = name. Reports any CSV rows
// with no match.
//
// Usage: npx tsx scripts/apply-seo-copy.ts

import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";
import { parse } from "csv-parse/sync";

config({ path: join(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
  realtime: { transport: ws as unknown as typeof WebSocket },
});

type Row = {
  slug: string;
  name: string;
  province: string;
  seo_title: string;
  seo_description: string;
  channel_description: string;
  featured: string;
};

type UpdatePayload = Pick<
  Row,
  "seo_title" | "seo_description" | "channel_description"
> & {
  province: string | null;
  featured: boolean;
};

function payloadFor(row: Row): UpdatePayload {
  return {
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    channel_description: row.channel_description,
    province: row.province?.trim() || null,
    featured: row.featured?.toLowerCase() === "true",
  };
}

async function main() {
  const csvPath = join(process.cwd(), "data", "dr-tv-seo-copy.csv");
  const raw = readFileSync(csvPath, "utf8");
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Row[];
  console.log(`Loaded ${rows.length} rows from ${csvPath}`);

  const matchedBySlug: string[] = [];
  const matchedByName: string[] = [];
  const unmatched: { slug: string; name: string }[] = [];
  let updateErrors = 0;

  for (const row of rows) {
    const patch = payloadFor(row);

    // Primary match: slug
    const bySlug = await supabase
      .from("channels")
      .update(patch, { count: "exact" })
      .eq("slug", row.slug)
      .select("id");

    if (bySlug.error) {
      console.error(`  update error (slug=${row.slug}): ${bySlug.error.message}`);
      updateErrors++;
      continue;
    }

    if ((bySlug.count ?? 0) > 0) {
      matchedBySlug.push(row.slug);
      continue;
    }

    // Fallback match: name (case-insensitive exact)
    const byName = await supabase
      .from("channels")
      .update(patch, { count: "exact" })
      .ilike("name", row.name)
      .select("id");

    if (byName.error) {
      console.error(`  update error (name=${row.name}): ${byName.error.message}`);
      updateErrors++;
      continue;
    }

    if ((byName.count ?? 0) > 0) {
      matchedByName.push(row.slug);
    } else {
      unmatched.push({ slug: row.slug, name: row.name });
    }
  }

  console.log("");
  console.log(`✓ Matched by slug: ${matchedBySlug.length}`);
  console.log(`↪ Matched by name (slug mismatch): ${matchedByName.length}`);
  if (matchedByName.length) {
    matchedByName.forEach((s) => console.log(`    - ${s}`));
  }
  console.log(`✗ Unmatched: ${unmatched.length}`);
  if (unmatched.length) {
    unmatched.forEach((r) => console.log(`    - ${r.slug}  (name: "${r.name}")`));
  }
  if (updateErrors) {
    console.log(`⚠ Update errors: ${updateErrors}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
