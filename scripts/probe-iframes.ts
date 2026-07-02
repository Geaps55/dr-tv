// Probe every iframe-based channel to check if its live stream is actually
// serving. Combines the SEO CSV (active iframe channels — spot-check for
// silent breakage) with the needs-review CSV (iframe_pending_check candidates
// — verify before flipping to active).
//
// For each iframe URL:
//   1. Fetch the player HTML
//   2. Extract the first .m3u8 stream URL from the response
//   3. Probe that .m3u8 and report the status
//
// Some player pages (e.g. vivalivetv) don't inline the .m3u8 — the script
// reports "(no .m3u8 in page)" for those; treat them as "iframe reachable"
// only and verify manually in a browser.
//
// Usage: npm run probe

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";

// Custom-port DR streaming servers frequently ship mismatched SSL certs.
// A probe that fails on cert issues is uninformative — bypass verification.
// This is a manual diagnostic script, never runs in production, never sees
// user-controlled URLs, so the risk here is trivial.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const FETCH_TIMEOUT_MS = 8000;

type Target = {
  name: string;
  slug: string;
  url: string;
  source: "active" | "needs_review";
};

function collectTargets(): Target[] {
  const root = process.cwd();
  const targets: Target[] = [];

  // Active iframe channels from the SEO CSV
  const seoRaw = readFileSync(join(root, "data", "dr-tv-seo-copy.csv"), "utf8");
  const seoRows = parse(seoRaw, { columns: true, skip_empty_lines: true, trim: true }) as Array<{
    slug: string; name: string; embed_type: string; embed_source: string;
  }>;
  for (const r of seoRows) {
    if (r.embed_type === "iframe" && r.embed_source) {
      targets.push({ name: r.name, slug: r.slug, url: r.embed_source, source: "active" });
    }
  }

  // Pending iframe candidates from the needs-review CSV
  const reviewRaw = readFileSync(join(root, "data", "dr-tv-needs-review-list.csv"), "utf8");
  const reviewRows = parse(reviewRaw, { columns: true, skip_empty_lines: true, trim: true }) as Array<{
    name: string; embed_type: string; embed_source: string;
  }>;
  for (const r of reviewRows) {
    if (r.embed_type === "iframe_pending_check" && r.embed_source) {
      targets.push({
        name: r.name,
        slug: r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        url: r.embed_source,
        source: "needs_review",
      });
    }
  }

  return targets;
}

async function fetchWithTimeout(url: string): Promise<Response | null> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: ctl.signal, redirect: "follow" });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

type Result = {
  target: Target;
  iframeStatus: number | "err";
  streamUrl: string | null;
  streamStatus: number | "err" | "n/a";
};

const M3U8_RE = /https?:\/\/[^"' <>\s]+\.m3u8[^"' <>\s]*/i;

async function probe(target: Target): Promise<Result> {
  const iframeRes = await fetchWithTimeout(target.url);
  if (!iframeRes) {
    return { target, iframeStatus: "err", streamUrl: null, streamStatus: "n/a" };
  }

  let streamUrl: string | null = null;
  let streamStatus: Result["streamStatus"] = "n/a";

  if (iframeRes.ok) {
    const body = await iframeRes.text();
    const match = body.match(M3U8_RE);
    if (match) {
      streamUrl = match[0];
      const streamRes = await fetchWithTimeout(streamUrl);
      streamStatus = streamRes ? streamRes.status : "err";
    }
  }

  return { target, iframeStatus: iframeRes.status, streamUrl, streamStatus };
}

function statusMark(iframe: Result["iframeStatus"], stream: Result["streamStatus"]) {
  if (iframe === "err" || (typeof iframe === "number" && iframe >= 400)) return "✗";
  if (stream === "n/a") return "⚠ ";
  if (stream === "err" || (typeof stream === "number" && stream >= 400)) return "✗";
  if (typeof stream === "number" && stream < 400) return "✓";
  return "?";
}

async function main() {
  const targets = collectTargets();
  console.log(`Probing ${targets.length} iframe channels…\n`);

  const results = await Promise.all(targets.map(probe));

  const nameWidth = Math.max(24, ...results.map((r) => r.target.name.length));
  const line = (n: string, src: string, iframe: string, stream: string, mark: string) =>
    `${mark}  ${n.padEnd(nameWidth)}  ${src.padEnd(12)}  iframe:${iframe.padEnd(6)}  stream:${stream}`;

  console.log(line("Channel", "State", "", "", " "));
  console.log(line("-".repeat(nameWidth), "----------", "------", "------", "-"));

  let live = 0, dead = 0, unverifiable = 0;
  for (const r of results) {
    const mark = statusMark(r.iframeStatus, r.streamStatus);
    const iframe = String(r.iframeStatus);
    const stream = r.streamStatus === "n/a" ? "(no .m3u8)" : String(r.streamStatus);
    console.log(line(r.target.name, r.target.source, iframe, stream, mark));
    if (mark === "✓") live++;
    else if (mark === "✗") dead++;
    else if (mark === "⚠ ") unverifiable++;
  }

  console.log(`\n✓ live: ${live}    ✗ dead: ${dead}    ⚠ unverifiable (no .m3u8 in page): ${unverifiable}`);
  console.log(`\nNote: "unverifiable" means the iframe loaded but no .m3u8 was in the HTML.`);
  console.log(`Those players fetch the stream via JS at runtime — verify in a real browser.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
