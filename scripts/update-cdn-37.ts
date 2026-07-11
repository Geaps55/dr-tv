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
    .update({
      embed_type: "iframe",
      embed_source: "https://geo.dailymotion.com/player/x1b7bk.html?video=x9lincs",
      fallback_url: "https://cdn.com.do/envivo/",
    })
    .eq("slug", "cdn-canal-37")
    .select("name,slug,embed_type,embed_source,fallback_url,status");

  if (error) {
    console.error("update failed:", error);
    process.exit(1);
  }
  console.log("updated rows:", JSON.stringify(data, null, 2));
}
main();
