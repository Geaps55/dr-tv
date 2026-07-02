// Fetch each channel's logo from its own website (fallback_url) and save
// locally so the UI can render a proper logo instead of an initials wordmark.
//
// Strategy per channel:
//   1. Fetch the fallback_url HTML
//   2. Score candidate logo sources in this priority order:
//        og:image > large <link rel="icon"> > apple-touch-icon > favicon > logo <img>
//   3. Download the winner to public/logos/[slug].{ext}
//
// Output:
//   - public/logos/[slug].{png,jpg,webp,svg,ico,gif}
//   - data/channel-logos.json — { slug: "/logos/[slug].png", ... }
//
// The CSV loader reads the manifest and populates Channel.logo_url. Channels
// without a downloaded logo keep the initials fallback.
//
// Usage: npm run logos
// Options: --force (re-download even if the file already exists)

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";
import { parse } from "csv-parse/sync";
import { readFileSync } from "node:fs";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const ROOT = process.cwd();
const LOGOS_DIR = join(ROOT, "public", "logos");
const MANIFEST_PATH = join(ROOT, "data", "channel-logos.json");
const CSV_PATH = join(ROOT, "data", "dr-tv-seo-copy.csv");
const FETCH_TIMEOUT_MS = 12_000;
const CONCURRENCY = 6;
const FORCE = process.argv.includes("--force");

type Row = { slug: string; name: string; fallback_url: string };

type Candidate = { url: string; score: number; label: string };

// Score higher = better logo candidate.
const RE_OG_IMAGE = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i;
const RE_ICON = /<link[^>]+rel=["']([^"']*icon[^"']*)["'][^>]*>/gi;
const RE_HREF = /href=["']([^"']+)["']/i;
const RE_SIZES = /sizes=["']([^"']+)["']/i;
const RE_LOGO_IMG = /<img[^>]+(?:class|id)=["'][^"']*logo[^"']*["'][^>]*>/i;
const RE_SRC = /src=["']([^"']+)["']/i;

function absolutize(href: string, baseUrl: string): string {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return href;
  }
}

function scoreIconSizes(sizes: string | undefined): number {
  if (!sizes) return 20;
  if (/svg/i.test(sizes)) return 90;
  const nums = sizes.match(/(\d+)/g) ?? [];
  const max = Math.max(0, ...nums.map(Number));
  if (max >= 256) return 80;
  if (max >= 128) return 70;
  if (max >= 64) return 50;
  return 25;
}

function findCandidates(html: string, base: string): Candidate[] {
  const cs: Candidate[] = [];

  const og = html.match(RE_OG_IMAGE);
  if (og) cs.push({ url: absolutize(og[1], base), score: 100, label: "og:image" });

  const linkMatches = Array.from(html.matchAll(RE_ICON));
  for (const m of linkMatches) {
    const tag = m[0];
    const relRaw = m[1].toLowerCase();
    const hrefMatch = tag.match(RE_HREF);
    if (!hrefMatch) continue;
    const url = absolutize(hrefMatch[1], base);
    const sizes = tag.match(RE_SIZES)?.[1];
    let score = scoreIconSizes(sizes);
    if (relRaw.includes("apple-touch")) score = Math.max(score, 60);
    if (relRaw.includes("mask-icon")) score = Math.max(score, 55);
    cs.push({ url, score, label: `link:${relRaw}` });
  }

  const imgMatch = html.match(RE_LOGO_IMG);
  if (imgMatch) {
    const src = imgMatch[0].match(RE_SRC);
    if (src) cs.push({ url: absolutize(src[1], base), score: 45, label: "img[class~=logo]" });
  }

  // Only used if we found no explicit icon links: implicit /favicon.ico
  if (!cs.some((c) => c.label.startsWith("link:"))) {
    cs.push({ url: absolutize("/favicon.ico", base), score: 15, label: "implicit favicon" });
  }

  return cs.sort((a, b) => b.score - a.score);
}

function extensionForContentType(ct: string, urlPath: string): string {
  const c = ct.toLowerCase();
  if (c.includes("svg")) return ".svg";
  if (c.includes("png")) return ".png";
  if (c.includes("webp")) return ".webp";
  if (c.includes("gif")) return ".gif";
  if (c.includes("jpeg") || c.includes("jpg")) return ".jpg";
  if (c.includes("icon") || c.includes("x-icon")) return ".ico";
  const ext = extname(urlPath).toLowerCase();
  if ([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".ico"].includes(ext)) {
    return ext === ".jpeg" ? ".jpg" : ext;
  }
  return ".png";
}

async function fetchWithTimeout(url: string, ms = FETCH_TIMEOUT_MS): Promise<Response | null> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    return await fetch(url, {
      signal: ctl.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; DR-TV-Bot/1.0)" },
    });
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

type Result = {
  slug: string;
  name: string;
  status: "ok" | "no-page" | "no-candidate" | "download-failed" | "skipped";
  logoUrl?: string;
  savedAs?: string;
  message?: string;
};

async function processRow(row: Row): Promise<Result> {
  const { slug, name, fallback_url } = row;

  if (!fallback_url) return { slug, name, status: "no-page", message: "no fallback_url" };

  // Facebook page URLs block scraping and rarely surface a useful <link rel=icon>.
  // Skip them cleanly rather than fail nosily.
  if (/facebook\.com/i.test(fallback_url)) {
    return { slug, name, status: "skipped", message: "facebook page" };
  }

  if (!FORCE) {
    const existing = ["png", "jpg", "webp", "svg", "ico", "gif"]
      .map((ext) => join(LOGOS_DIR, `${slug}.${ext}`))
      .find((p) => existsSync(p));
    if (existing) {
      return {
        slug,
        name,
        status: "ok",
        logoUrl: `/logos/${slug}${extname(existing)}`,
        savedAs: existing,
        message: "already exists",
      };
    }
  }

  const pageRes = await fetchWithTimeout(fallback_url);
  if (!pageRes || !pageRes.ok) {
    return { slug, name, status: "no-page", message: `page fetch ${pageRes?.status ?? "err"}` };
  }
  const html = await pageRes.text();
  const candidates = findCandidates(html, pageRes.url || fallback_url);
  if (candidates.length === 0) {
    return { slug, name, status: "no-candidate", message: "no logo tags found" };
  }

  for (const cand of candidates) {
    const imgRes = await fetchWithTimeout(cand.url);
    if (!imgRes || !imgRes.ok) continue;
    const ct = imgRes.headers.get("content-type") ?? "";
    if (!ct.startsWith("image/") && !ct.includes("svg")) continue;
    const buf = Buffer.from(await imgRes.arrayBuffer());
    if (buf.byteLength < 200) continue; // 1x1 tracking pixel etc.
    const ext = extensionForContentType(ct, new URL(cand.url).pathname);
    const outPath = join(LOGOS_DIR, `${slug}${ext}`);
    writeFileSync(outPath, buf);
    return {
      slug,
      name,
      status: "ok",
      logoUrl: `/logos/${slug}${ext}`,
      savedAs: outPath,
      message: `${cand.label} (${(buf.byteLength / 1024).toFixed(0)}kb)`,
    };
  }

  return { slug, name, status: "download-failed", message: "no candidate returned a valid image" };
}

async function runWithConcurrency<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let idx = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = idx++;
      if (i >= items.length) return;
      results[i] = await worker(items[i]);
    }
  });
  await Promise.all(runners);
  return results;
}

async function main() {
  mkdirSync(LOGOS_DIR, { recursive: true });
  const csvRaw = readFileSync(CSV_PATH, "utf8");
  const rows = parse(csvRaw, { columns: true, skip_empty_lines: true, trim: true }) as Row[];
  console.log(`Fetching logos for ${rows.length} channels (concurrency=${CONCURRENCY})…`);

  const results = await runWithConcurrency(rows, CONCURRENCY, async (row) => {
    const res = await processRow(row);
    const icon = { ok: "✓", "no-page": "✗", "no-candidate": "?", "download-failed": "✗", skipped: "-" }[res.status];
    console.log(`  ${icon}  ${res.slug.padEnd(40)}  ${res.status.padEnd(16)}  ${res.message ?? ""}`);
    return res;
  });

  const manifest: Record<string, string> = {};
  for (const r of results) {
    if (r.status === "ok" && r.logoUrl) manifest[r.slug] = r.logoUrl;
  }
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  const byStatus = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});
  console.log("");
  console.log(`Manifest written: ${MANIFEST_PATH} (${Object.keys(manifest).length} entries)`);
  console.log(`Summary: ${JSON.stringify(byStatus)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
