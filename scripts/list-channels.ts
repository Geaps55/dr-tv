// One-off: prints existing channels (name + slug) from Supabase.
import { config } from "dotenv";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";

config({ path: join(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, key, {
  auth: { persistSession: false },
  realtime: { transport: ws as unknown as typeof WebSocket },
});

async function main() {
  const { data, error } = await supabase
    .from("channels")
    .select("name,slug,embed_type,embed_source,status")
    .order("name");
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log(JSON.stringify(data, null, 2));
}
main();
