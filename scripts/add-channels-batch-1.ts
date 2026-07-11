// Batch-1 additions sourced from dominicanchannels.com (2026-07-05).
// Every embed URL was HTTP-probed (200 OK) before including here.
// Upserts on slug — safe to re-run.
//
// Usage: npx tsx scripts/add-channels-batch-1.ts

import { config } from "dotenv";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";

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
  name: string;
  slug: string;
  category: "national-news" | "sports" | "entertainment" | "regional" | "christian";
  province?: string | null;
  embed_type: "youtube" | "hls" | "facebook" | "iframe" | "link_only";
  embed_source: string;
  seo_title: string;
  seo_description: string;
  channel_description: string;
  status: "active";
};

const rows: Row[] = [
  {
    name: "RNN Canal 27",
    slug: "rnn-canal-27",
    category: "national-news",
    embed_type: "hls",
    embed_source: "https://2-fss-2.streamhoster.com/pl_138/206532-6829902-1/playlist.m3u8",
    seo_title: "RNN Canal 27 en Vivo Online | Noticias y TV Dominicana - DR TV",
    seo_description:
      "Mira RNN Canal 27 en vivo online gratis, 24 horas al día. Transmisión en vivo, sin cortes, directo desde República Dominicana.",
    channel_description:
      "RNN Canal 27 (Red Nacional de Noticias) es un canal de referencia en noticias y actualidad dominicana. En DR TV puedes seguir su transmisión en vivo directamente, sin salir de la página, ya sea que estés en la isla o formes parte de la diáspora dominicana en el exterior.",
    status: "active",
  },
  {
    name: "Orbit TV",
    slug: "orbit-tv",
    category: "regional",
    province: "Los Alcarrizos",
    embed_type: "hls",
    embed_source: "https://cnn.hostlagarto.com/orbittv/index.m3u8",
    seo_title: "Orbit TV en Vivo Online | TV de Los Alcarrizos - DR TV",
    seo_description:
      "Mira Orbit TV en vivo online gratis, 24 horas al día. Transmisión local desde Los Alcarrizos, Santo Domingo, sin cortes.",
    channel_description:
      "Orbit TV es un canal local de televisión con transmisión desde Los Alcarrizos, en la provincia de Santo Domingo. Su programación combina noticias comunitarias, cultura y variedades locales. En DR TV puedes seguir su transmisión en vivo directamente, sin salir de la página, ya sea que estés en la isla o formes parte de la diáspora dominicana en el exterior.",
    status: "active",
  },
  {
    name: "Digital Vision 63",
    slug: "digital-vision-63",
    category: "national-news",
    embed_type: "hls",
    embed_source: "https://ss2.tvrdomi.com:1936/digitalvision/digitalvision/playlist.m3u8",
    seo_title: "Digital Vision 63 en Vivo Online | TV Dominicana - DR TV",
    seo_description:
      "Mira Digital Vision 63 en vivo online gratis, 24 horas al día. Transmisión en vivo, sin cortes, directo desde República Dominicana.",
    channel_description:
      "Digital Vision 63 es un canal de televisión dominicano con programación general de noticias, opinión y variedades. En DR TV puedes seguir su transmisión en vivo directamente, sin salir de la página, ya sea que estés en la isla o formes parte de la diáspora dominicana en el exterior.",
    status: "active",
  },
  {
    name: "AME TV Canal 47",
    slug: "ame-tv-canal-47",
    category: "national-news",
    embed_type: "hls",
    embed_source: "https://ss2.tvrdomi.com:1936/ame47/ame47/playlist.m3u8",
    seo_title: "AME TV Canal 47 en Vivo Online | TV Dominicana - DR TV",
    seo_description:
      "Mira AME TV Canal 47 en vivo online gratis, 24 horas al día. Transmisión en vivo, sin cortes, directo desde República Dominicana.",
    channel_description:
      "AME TV Canal 47 es un canal de televisión dominicano con programación general que incluye espacios de opinión, entretenimiento y variedades. En DR TV puedes seguir su transmisión en vivo directamente, sin salir de la página, ya sea que estés en la isla o formes parte de la diáspora dominicana en el exterior.",
    status: "active",
  },
  {
    name: "Telemedios Canal 8",
    slug: "telemedios-canal-8",
    category: "national-news",
    embed_type: "iframe",
    embed_source: "https://cvinetwork.org/canal8.htm",
    seo_title: "Telemedios Canal 8 en Vivo Online | TV Dominicana - DR TV",
    seo_description:
      "Mira Telemedios Canal 8 en vivo online gratis, 24 horas al día. Transmisión en vivo, sin cortes, directo desde República Dominicana.",
    channel_description:
      "Telemedios Canal 8 es un canal dominicano operado por Telemedios Dominicanos, S.A., con programación general que combina noticias, opinión y entretenimiento. En DR TV puedes seguir su transmisión en vivo directamente, sin salir de la página, ya sea que estés en la isla o formes parte de la diáspora dominicana en el exterior.",
    status: "active",
  },
  {
    name: "Coral 39",
    slug: "coral-39",
    category: "national-news",
    embed_type: "iframe",
    embed_source: "https://geo.dailymotion.com/player.html?video=x84nyz2",
    seo_title: "Coral 39 en Vivo Online | TV Dominicana - DR TV",
    seo_description:
      "Mira Coral 39 en vivo online gratis, 24 horas al día. Transmisión en vivo, sin cortes, directo desde República Dominicana.",
    channel_description:
      "Coral 39 es un canal de televisión dominicano de programación general con espacios de noticias, opinión y entretenimiento. En DR TV puedes seguir su transmisión en vivo directamente, sin salir de la página, ya sea que estés en la isla o formes parte de la diáspora dominicana en el exterior.",
    status: "active",
  },
  {
    name: "VTV Canal 32",
    slug: "vtv-canal-32",
    category: "national-news",
    embed_type: "hls",
    embed_source: "https://edge.livestreaminggroup.info/vtv32live/index.m3u8",
    seo_title: "VTV Canal 32 en Vivo Online | TV Dominicana - DR TV",
    seo_description:
      "Mira VTV Canal 32 en vivo online gratis, 24 horas al día. Transmisión en vivo, sin cortes, directo desde República Dominicana.",
    channel_description:
      "VTV Canal 32 es un canal de televisión dominicano con programación general que abarca noticias, entretenimiento y variedades. En DR TV puedes seguir su transmisión en vivo directamente, sin salir de la página, ya sea que estés en la isla o formes parte de la diáspora dominicana en el exterior.",
    status: "active",
  },
  {
    name: "Ahora TV Canal 3",
    slug: "ahora-tv-canal-3",
    category: "national-news",
    embed_type: "hls",
    embed_source: "https://stream.haislin.com/ahoratv/index.m3u8",
    seo_title: "Ahora TV Canal 3 (ATV) en Vivo Online | TV Dominicana - DR TV",
    seo_description:
      "Mira Ahora TV Canal 3 (ATV) en vivo online gratis, 24 horas al día. Transmisión en vivo, sin cortes, directo desde Santo Domingo.",
    channel_description:
      "Ahora TV (ATV) Canal 3 es un canal dominicano con base en Santo Domingo, con programación general que incluye noticias, opinión y entretenimiento. En DR TV puedes seguir su transmisión en vivo directamente, sin salir de la página, ya sea que estés en la isla o formes parte de la diáspora dominicana en el exterior.",
    status: "active",
  },
  {
    name: "Nexxo TV Canal 20",
    slug: "nexxo-tv-canal-20",
    category: "regional",
    province: "Santiago",
    embed_type: "hls",
    embed_source: "https://edge.essastream.com/nexxontv/index.m3u8",
    seo_title: "Nexxo TV Canal 20 en Vivo Online | TV de Santiago - DR TV",
    seo_description:
      "Mira Nexxo TV Canal 20 en vivo online gratis, 24 horas al día. Transmisión desde Santiago, República Dominicana, sin cortes.",
    channel_description:
      "Nexxo TV Canal 20 es un canal de televisión con transmisión desde Santiago de los Caballeros. Su programación combina noticias regionales, cultura, música y variedades. En DR TV puedes seguir su transmisión en vivo directamente, sin salir de la página, ya sea que estés en la isla o formes parte de la diáspora dominicana en el exterior.",
    status: "active",
  },
  {
    name: "Telecanal 12",
    slug: "telecanal-12",
    category: "regional",
    province: "Mao",
    embed_type: "hls",
    embed_source: "https://edge.essastream.com/telecanal12/index.m3u8",
    seo_title: "Telecanal 12 en Vivo Online | TV de Mao, Valverde - DR TV",
    seo_description:
      "Mira Telecanal 12 en vivo online gratis, 24 horas al día. Transmisión desde Mao, Valverde, sin cortes.",
    channel_description:
      "Telecanal 12 es un canal local de televisión con transmisión desde Mao, provincia Valverde. Su programación se centra en noticias comunitarias, cultura y variedades regionales del Cibao occidental. En DR TV puedes seguir su transmisión en vivo directamente, sin salir de la página, ya sea que estés en la isla o formes parte de la diáspora dominicana en el exterior.",
    status: "active",
  },
  {
    name: "Telecanal 28",
    slug: "telecanal-28",
    category: "national-news",
    embed_type: "hls",
    embed_source: "https://edge.essastream.com/telecanal28/index.m3u8",
    seo_title: "Telecanal 28 en Vivo Online | TV Dominicana - DR TV",
    seo_description:
      "Mira Telecanal 28 en vivo online gratis, 24 horas al día. Transmisión en vivo, sin cortes, directo desde República Dominicana.",
    channel_description:
      "Telecanal 28 es un canal de televisión dominicano con programación general de noticias, opinión y entretenimiento. En DR TV puedes seguir su transmisión en vivo directamente, sin salir de la página, ya sea que estés en la isla o formes parte de la diáspora dominicana en el exterior.",
    status: "active",
  },
  {
    name: "Canal 6 HD",
    slug: "canal-6-hd",
    category: "national-news",
    embed_type: "hls",
    embed_source: "https://stream.elseis.do/canal6/live_1080.m3u8",
    seo_title: "Canal 6 HD en Vivo Online | TV Dominicana - DR TV",
    seo_description:
      "Mira Canal 6 HD en vivo online gratis, 24 horas al día. Transmisión en vivo, sin cortes, directo desde República Dominicana.",
    channel_description:
      "Canal 6 HD es un canal dominicano con programación general de noticias, opinión, deportes y entretenimiento. En DR TV puedes seguir su transmisión en vivo directamente, sin salir de la página, ya sea que estés en la isla o formes parte de la diáspora dominicana en el exterior.",
    status: "active",
  },
  {
    name: "Boca Chica TV",
    slug: "boca-chica-tv",
    category: "regional",
    province: "Boca Chica",
    embed_type: "hls",
    embed_source: "https://cdnfox.hostlagarto.com/bocachicatv/index.m3u8",
    seo_title: "Boca Chica TV en Vivo Online | TV de Boca Chica - DR TV",
    seo_description:
      "Mira Boca Chica TV en vivo online gratis, 24 horas al día. Transmisión desde Boca Chica, Santo Domingo, sin cortes.",
    channel_description:
      "Boca Chica TV es un canal local con transmisión desde el municipio turístico de Boca Chica. Su programación abarca noticias comunitarias, cultura, turismo y variedades locales. En DR TV puedes seguir su transmisión en vivo directamente, sin salir de la página, ya sea que estés en la isla o formes parte de la diáspora dominicana en el exterior.",
    status: "active",
  },
];

async function main() {
  console.log(`Upserting ${rows.length} channels…`);
  const { data, error } = await supabase
    .from("channels")
    .upsert(rows, { onConflict: "slug", ignoreDuplicates: false })
    .select("slug,name");
  if (error) {
    console.error("Upsert failed:", error);
    process.exit(1);
  }
  console.log(`Upserted ${data?.length ?? 0} rows:`);
  data?.forEach((r) => console.log(` - ${r.slug} (${r.name})`));
}

main();
