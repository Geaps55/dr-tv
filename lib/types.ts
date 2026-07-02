export type Category =
  | "national-news"
  | "sports"
  | "entertainment"
  | "regional"
  | "christian";

export type EmbedType = "youtube" | "hls" | "facebook" | "iframe" | "link_only";

export type ChannelStatus = "active" | "broken" | "needs_review";

export type Channel = {
  id: string;
  name: string;
  slug: string;
  category: Category;
  province: string | null;
  logo_url: string | null;
  channel_description: string;
  embed_type: EmbedType;
  embed_source: string;
  fallback_url: string | null;
  seo_title: string;
  seo_description: string;
  status: ChannelStatus;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  site_title: string;
  site_tagline: string;
  default_seo_description: string;
  adsense_client_id: string;
  ads_zone_a_enabled: boolean;
  ads_zone_b_enabled: boolean;
  ads_zone_c_enabled: boolean;
  ads_zone_d_enabled: boolean;
};

export const CATEGORIES: { key: Category; label: string; seoTitle: string; seoDescription: string }[] = [
  {
    key: "national-news",
    label: "Nacionales y Noticias",
    seoTitle: "Canales Nacionales y de Noticias en Vivo | DR TV",
    seoDescription: "Mira en vivo los canales nacionales y de noticias de República Dominicana.",
  },
  {
    key: "sports",
    label: "Deportes",
    seoTitle: "Canales de Deportes en Vivo | DR TV",
    seoDescription: "Todos los canales dominicanos de deportes transmitiendo en vivo online.",
  },
  {
    key: "entertainment",
    label: "Entretenimiento",
    seoTitle: "Canales de Entretenimiento en Vivo | DR TV",
    seoDescription: "Música, farándula, cine y programación variada dominicana en vivo.",
  },
  {
    key: "regional",
    label: "Regionales",
    seoTitle: "Canales Regionales Dominicanos en Vivo | DR TV",
    seoDescription: "Canales de televisión regionales de todas las provincias de República Dominicana.",
  },
  {
    key: "christian",
    label: "Cristianos",
    seoTitle: "Canales Cristianos en Vivo | DR TV",
    seoDescription: "Canales cristianos y católicos dominicanos transmitiendo en vivo.",
  },
];

export const CATEGORY_LABELS: Record<Category, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label]),
) as Record<Category, string>;
