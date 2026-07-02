import { cache } from "react";
import { supabaseAnon, isSupabaseConfigured } from "./supabase";
import type { Category, Channel, SiteSettings } from "./types";
import { readChannelsSource } from "./csv-channels";

// Dev-mode fallback: when Supabase env vars aren't set, hydrate the site from
// the copy-ready CSV so the UI is previewable before a Supabase project exists.
// Real deployments always use Supabase.
function mockChannelsFromCsv(): Channel[] {
  const now = new Date().toISOString();
  return readChannelsSource(process.cwd()).map((c, i) => ({
    ...c,
    id: `mock-${i}`,
    created_at: now,
    updated_at: now,
  }));
}

const DEFAULT_SETTINGS: SiteSettings = {
  site_title: "DR TV — Canales Dominicanos en Vivo",
  site_tagline: "Todos los canales de televisión dominicanos, en un solo lugar.",
  default_seo_description:
    "Mira los canales de televisión dominicanos en vivo online gratis. Noticias, deportes, entretenimiento y canales regionales de República Dominicana.",
  adsense_client_id: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "",
  ads_zone_a_enabled: true,
  ads_zone_b_enabled: true,
  ads_zone_c_enabled: true,
  ads_zone_d_enabled: true,
};

// Raw list including any status. Used only by direct-URL paths (/canal/[slug])
// and admin, so status='needs_review' channels have a page but don't appear
// in public grids or the sitemap.
const getAllChannelsIncludingReview = cache(async (): Promise<Channel[]> => {
  if (!isSupabaseConfigured()) return mockChannelsFromCsv();
  const { data, error } = await supabaseAnon()
    .from("channels")
    .select("*")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Channel[];
});

// Public-facing list: active channels only. Used by home, category, sitemap,
// related-channels — anywhere that shouldn't surface not-yet-verified feeds.
export const getAllChannels = cache(async (): Promise<Channel[]> => {
  const all = await getAllChannelsIncludingReview();
  return all.filter((c) => c.status === "active");
});

export async function getChannelsByCategory(category: Category): Promise<Channel[]> {
  const all = await getAllChannels();
  return all.filter((c) => c.category === category);
}

export async function getFeaturedChannels(): Promise<Channel[]> {
  const all = await getAllChannels();
  return all.filter((c) => c.featured);
}

// Deliberately reads the raw list so /canal/[slug] can serve needs_review
// pages during the verification pass.
export async function getChannelBySlug(slug: string): Promise<Channel | null> {
  const all = await getAllChannelsIncludingReview();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function getRelatedChannels(channel: Channel, limit = 6): Promise<Channel[]> {
  const all = await getAllChannels();
  const sameProvince = channel.province
    ? all.filter((c) => c.id !== channel.id && c.province === channel.province)
    : [];
  const sameCategory = all.filter(
    (c) => c.id !== channel.id && c.category === channel.category && !sameProvince.includes(c),
  );
  return [...sameProvince, ...sameCategory].slice(0, limit);
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSupabaseConfigured()) return DEFAULT_SETTINGS;
  const { data, error } = await supabaseAnon().from("site_settings").select("*");
  if (error) return DEFAULT_SETTINGS;
  const map = new Map((data ?? []).map((r: { key: string; value: string | null }) => [r.key, r.value]));
  const bool = (key: keyof SiteSettings, fallback: boolean) => {
    const v = map.get(key as string);
    if (v == null) return fallback;
    return v === "true" || v === "1";
  };
  const str = (key: keyof SiteSettings, fallback: string) => (map.get(key as string) as string) ?? fallback;
  return {
    site_title: str("site_title", DEFAULT_SETTINGS.site_title),
    site_tagline: str("site_tagline", DEFAULT_SETTINGS.site_tagline),
    default_seo_description: str("default_seo_description", DEFAULT_SETTINGS.default_seo_description),
    adsense_client_id: str("adsense_client_id", DEFAULT_SETTINGS.adsense_client_id),
    ads_zone_a_enabled: bool("ads_zone_a_enabled", true),
    ads_zone_b_enabled: bool("ads_zone_b_enabled", true),
    ads_zone_c_enabled: bool("ads_zone_c_enabled", true),
    ads_zone_d_enabled: bool("ads_zone_d_enabled", true),
  };
});
