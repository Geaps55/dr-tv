import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";
import { slugify } from "./slug";
import type { Category, Channel, EmbedType } from "./types";

// Optional slug → public logo path map produced by `npm run logos`.
// If the file doesn't exist yet, all channels fall back to the initials wordmark.
let logoManifest: Record<string, string> | null = null;
function loadLogoManifest(root: string): Record<string, string> {
  if (logoManifest) return logoManifest;
  const p = join(root, "data", "channel-logos.json");
  if (!existsSync(p)) {
    logoManifest = {};
    return logoManifest;
  }
  try {
    logoManifest = JSON.parse(readFileSync(p, "utf8")) as Record<string, string>;
  } catch {
    logoManifest = {};
  }
  return logoManifest;
}

type CsvRow = {
  name: string;
  domain: string;
  notes: string;
  likely_category: string;
  http_status: string;
  embed_type: string;
  embed_source: string;
  verify_notes: string;
};

// Names that ship as "featured" per the build prompt: Baní Visión + any US-diaspora priority channels.
// RetroVisión TV is in the needs-review CSV and gets flagged featured when it's manually added later.
const FEATURED_NAMES = new Set([
  "Baní Visión",
  "Televisión Dominicana (USA)",
  "Aliento Visión TV",
]);

const VALID_CATEGORIES: Category[] = [
  "national-news",
  "sports",
  "entertainment",
  "regional",
  "christian",
];
const VALID_EMBED_TYPES: EmbedType[] = ["youtube", "hls", "facebook", "iframe", "link_only"];

function toCategory(raw: string): Category {
  const value = raw.trim() as Category;
  return VALID_CATEGORIES.includes(value) ? value : "entertainment";
}

function toEmbedType(raw: string): EmbedType {
  const value = raw.trim() as EmbedType;
  return VALID_EMBED_TYPES.includes(value) ? value : "link_only";
}

// The "notes" column is a mix of provinces, descriptors, and internal markers.
// Only lift it into `province` when it looks like a location for a regional channel.
function extractProvince(category: Category, notes: string): string | null {
  if (category !== "regional") return null;
  const cleaned = notes.trim();
  if (!cleaned) return null;
  // Skip descriptor-looking entries (contain slashes, dashes with words, or lowercase-heavy strings).
  if (/[/]/.test(cleaned)) return null;
  if (/\b(network|channel|production|company|niche|circuit|arm|programming|closed-circuit)\b/i.test(cleaned)) return null;
  // Take just the primary location fragment (before " - " commentary).
  const primary = cleaned.split(/ - | – /)[0].trim();
  if (primary.length > 60) return null;
  return primary || null;
}

function describe(name: string, category: Category, notes: string, province: string | null): string {
  const location = province ? ` con base en ${province}` : "";
  const noteFragment = notes && !/^[a-z]/i.test(notes) === false && notes.length < 120
    ? notes
    : "";
  switch (category) {
    case "regional":
      return `${name} es un canal de televisión regional dominicano${location}. Puedes ver ${name} en vivo online gratis aquí en DR TV, la guía completa de televisión dominicana.`;
    case "national-news":
      return `${name} es una cadena de televisión dominicana con cobertura nacional que transmite noticias, análisis y programación variada. Míralo en vivo online aquí en DR TV.`;
    case "sports":
      return `${name} es un canal dominicano dedicado a la cobertura deportiva. Sigue partidos, análisis y programación deportiva en vivo aquí en DR TV.`;
    case "christian":
      return `${name} es un canal de televisión cristiano dominicano con programación de fe, música y mensajes. Míralo en vivo aquí en DR TV.`;
    case "entertainment":
    default:
      return `${name} es un canal de entretenimiento dominicano con música, farándula y programación variada. Míralo en vivo online aquí en DR TV.`;
  }
}

function seoDescription(name: string, description: string): string {
  const snippet = description.slice(0, 110).replace(/\s+\S*$/, "").trim();
  return `Mira ${name} en vivo online gratis. ${snippet}`;
}

export type SeedChannel = Omit<Channel, "id" | "created_at" | "updated_at">;

export function buildChannelFromRow(row: CsvRow, index: number): SeedChannel {
  const name = row.name.trim();
  const category = toCategory(row.likely_category);
  const province = extractProvince(category, row.notes);
  const embed_type = toEmbedType(row.embed_type);
  const embed_source = row.embed_source.trim();
  const channel_description = describe(name, category, row.notes.trim(), province);
  const seo_title = `${name} en Vivo | DR TV`;
  const seo_desc = seoDescription(name, channel_description);
  return {
    name,
    slug: slugify(name),
    category,
    province,
    logo_url: null,
    channel_description,
    embed_type,
    embed_source: embed_source || row.domain.trim(),
    fallback_url: row.domain.trim() || null,
    seo_title,
    seo_description: seo_desc,
    status: "active",
    featured: FEATURED_NAMES.has(name),
    sort_order: index,
  };
}

export function readWorkingListCsv(root: string): SeedChannel[] {
  const csvPath = join(root, "data", "dr-tv-working-list.csv");
  const raw = readFileSync(csvPath, "utf8");
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];
  return rows
    .filter((r) => r.name && r.embed_source)
    .map((r, i) => buildChannelFromRow(r, i));
}

// Copy-ready CSV (hand-written seo_title, seo_description, channel_description
// per row). Preferred source when present — falls back to the working list
// otherwise. Categorises featured channels per the diaspora list.
type SeoCsvRow = {
  slug: string;
  name: string;
  category: string;
  province: string;
  seo_title: string;
  seo_description: string;
  channel_description: string;
  embed_type: string;
  embed_source: string;
  fallback_url: string;
  featured: string;
};

export function readSeoCopyCsv(root: string): SeedChannel[] {
  const csvPath = join(root, "data", "dr-tv-seo-copy.csv");
  const raw = readFileSync(csvPath, "utf8");
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as SeoCsvRow[];
  return rows
    .filter((r) => r.slug && r.name && r.embed_source)
    .map((r, i): SeedChannel => ({
      name: r.name,
      slug: r.slug,
      category: toCategory(r.category),
      province: r.province?.trim() || null,
      logo_url: loadLogoManifest(root)[r.slug] ?? null,
      channel_description: r.channel_description,
      embed_type: toEmbedType(r.embed_type),
      embed_source: r.embed_source,
      fallback_url: r.fallback_url?.trim() || null,
      seo_title: r.seo_title,
      seo_description: r.seo_description,
      status: "active",
      featured: r.featured?.toLowerCase() === "true",
      sort_order: i,
    }));
}

// Needs-review CSV: rows flagged embed_type='iframe_pending_check' have a
// candidate embed URL that loaded successfully in a headless browser but
// couldn't be verified from the sandbox (custom ports blocked). We include
// them in the site as status='needs_review' so pages exist and their iframes
// can be smoke-tested in a real browser, then flipped to 'active' via admin.
type ReviewCsvRow = {
  name: string;
  domain: string;
  notes: string;
  likely_category: string;
  http_status: string;
  embed_type: string;
  embed_source: string;
  verify_notes: string;
};

export function readPendingIframeCandidates(root: string): SeedChannel[] {
  const csvPath = join(root, "data", "dr-tv-needs-review-list.csv");
  if (!existsSync(csvPath)) return [];
  const raw = readFileSync(csvPath, "utf8");
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as ReviewCsvRow[];

  return rows
    .filter((r) => r.embed_type === "iframe_pending_check" && r.embed_source)
    .map((r, i): SeedChannel => {
      const name = r.name.trim();
      const category = toCategory(r.likely_category);
      const province = extractProvince(category, r.notes);
      const description = describe(name, category, r.notes, province);
      return {
        name,
        slug: slugify(name),
        category,
        province,
        logo_url: loadLogoManifest(root)[slugify(name)] ?? null,
        channel_description: description,
        embed_type: "iframe",
        embed_source: r.embed_source.trim(),
        fallback_url: r.domain.trim() || null,
        seo_title: `${name} en Vivo | DR TV`,
        seo_description: seoDescription(name, description),
        status: "needs_review",
        featured: false,
        sort_order: 1000 + i,
      };
    });
}

// Prefer the copy-ready CSV when it exists. Falls back to the auto-templated
// working list so first-time setups without hand-written copy still boot.
// Always appends any iframe_pending_check candidates from the needs-review CSV
// with status='needs_review'.
export function readChannelsSource(root: string): SeedChannel[] {
  const seoPath = join(root, "data", "dr-tv-seo-copy.csv");
  const primary = existsSync(seoPath) ? readSeoCopyCsv(root) : readWorkingListCsv(root);
  const pending = readPendingIframeCandidates(root);
  return [...primary, ...pending];
}
