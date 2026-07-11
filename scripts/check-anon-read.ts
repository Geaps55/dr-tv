// Verify the anon key can read the new rows we just inserted.
import { config } from "dotenv";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";

config({ path: join(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function count(key: string, label: string) {
  const c = createClient(url, key, {
    auth: { persistSession: false },
    realtime: { transport: ws as unknown as typeof WebSocket },
  });
  const { data, error } = await c
    .from("channels")
    .select("slug,name,status")
    .in("slug", [
      "rnn-canal-27",
      "orbit-tv",
      "digital-vision-63",
      "ame-tv-canal-47",
      "telemedios-canal-8",
      "coral-39",
      "vtv-canal-32",
      "ahora-tv-canal-3",
      "nexxo-tv-canal-20",
      "telecanal-12",
      "telecanal-28",
      "canal-6-hd",
      "boca-chica-tv",
    ]);
  console.log(`${label}: ${data?.length ?? 0} rows read${error ? ` (error: ${error.message})` : ""}`);
  if (data) data.forEach((r) => console.log(`  ${r.slug}  status=${r.status}`));
}

(async () => {
  await count(anon, "ANON");
  await count(service, "SERVICE");
})();
