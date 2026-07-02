# DR TV — Claude Code Master Build Prompt

Paste this directly into Claude Code to bootstrap the app. Stack: Next.js (App Router) + Supabase + Tailwind.

---

## 1. What this app is

"DR TV" — a Dominican Republic live TV directory. Every channel has its own page with the live stream embedded directly, a channel description, and full SEO metadata. Home page is a category-filtered grid. Google AdSense is integrated with designated ad zones. An admin panel lets Geaps edit channel info, descriptions, and SEO fields without touching code.

---

## 2. Data model (Supabase)

```sql
create table channels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,                 -- used in /canal/[slug]
  category text not null,                    -- 'national-news' | 'sports' | 'entertainment' | 'regional' | 'christian'
  province text,                             -- populated when category = 'regional'
  logo_url text,
  channel_description text not null,         -- shown under the player on the page, editable
  embed_type text not null,                  -- 'youtube' | 'hls' | 'facebook' | 'link_only'
  embed_source text not null,                -- channel/video ID, m3u8 URL, or FB video URL
  fallback_url text,                         -- station's own site, shown if embed fails
  seo_title text not null,                   -- <title> tag, editable, defaults to "{name} en Vivo | DR TV"
  seo_description text not null,             -- meta description, editable, defaults to a templated line using channel_description
  status text default 'active',              -- 'active' | 'broken' | 'needs_review'
  featured boolean default false,            -- true for Baní Visión, RetroVisión TV, and any diaspora/priority channels
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table site_settings (
  key text primary key,
  value text
);
-- seed rows: 'site_title', 'site_tagline', 'default_seo_description', 'adsense_client_id'
```

Seed `channels` from `dr-tv-working-list.csv` (72 rows, embed_type/embed_source already populated by the verification pass). Leave `dr-tv-needs-review-list.csv` out of the initial seed — those get added once manually confirmed.

---

## 3. Site structure & routes

- `/` — Home. Category filter bar (All / National & News / Sports / Entertainment / Regional / Christian) + responsive grid of channel cards (logo, name, "EN VIVO" badge). Featured channels (Baní Visión, RetroVisión TV) get a highlighted row above the main grid.
- `/canal/[slug]` — Channel detail page (see section 4 below — this is the page that needs to look great and rank well).
- `/categoria/[category]` — Category listing page (also gets its own SEO title/description, e.g. "Canales de Noticias en Vivo | DR TV").
- `/admin` — Password-protected admin panel (see section 6).

---

## 4. Channel detail page (`/canal/[slug]`) — layout & SEO

This is the core page. Structure top to bottom:

1. **Channel name** — large, prominent, at the very top of the page (h1). This is the first thing a visitor and a search crawler sees.
2. **Live player** — embedded inline based on `embed_type`:
   - `youtube` → standard YouTube iframe embed
   - `hls` → HTML5 `<video>` with hls.js, autoplay muted (browser autoplay policy), unmute-on-click affordance
   - `facebook` → Facebook video plugin iframe
   - If the embed fails to load (onerror / timeout), swap to a "Ver en [Station Name] →" card linking to `fallback_url`
3. **Channel description** — directly under the player, using `channel_description` from the database. This is where the "make it interesting" part lives — real, specific copy about the station (region, what it's known for, founding year if notable), not generic filler.
4. **Ad zone A** (see section 5) — placed after the description, before related channels.
5. **Related channels** — same category or same province, small card row.

### SEO implementation (Next.js metadata API)

Use `generateMetadata()` per page, pulling from `seo_title` / `seo_description` in Supabase:

```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const channel = await getChannel(params.slug);
  return {
    title: channel.seo_title,
    description: channel.seo_description,
    openGraph: {
      title: channel.seo_title,
      description: channel.seo_description,
      images: [channel.logo_url],
      type: 'video.other',
    },
    twitter: {
      card: 'summary_large_image',
      title: channel.seo_title,
      description: channel.seo_description,
    },
  };
}
```

Also add **JSON-LD structured data** (`BroadcastEvent` or `VideoObject` schema) injected via a `<script type="application/ld+json">` tag on each channel page — this is what search engines and browsers specifically look for beyond the meta tags, and improves the odds of rich results in Google. Include channel name, description, thumbnail, and a `isLiveBroadcast: true` flag.

Every page (home, category, channel) needs a unique `<title>` and meta description — no two pages share the same tags. Default fallback templates:
- Title: `{Channel Name} en Vivo | DR TV`
- Description: `Mira {Channel Name} en vivo online gratis. {first 100 chars of channel_description}`

---

## 5. Google AdSense integration

Add the AdSense script in the root layout (`<Script>` tag, `strategy="afterInteractive"`), client ID pulled from `site_settings`.

**Ad zone placement** (based on standard performance patterns for content/video directory sites — display ads that sit *adjacent to* content the visitor is already engaged with outperform ads stacked at the very top before any content loads):

- **Zone A — In-article, post-description** (channel pages): placed right after `channel_description`, before related channels. This is Google's "in-article" ad format — it sits within content the reader is actively reading, which is typically the strongest-performing placement on content pages.
- **Zone B — Sidebar** (desktop only, channel pages): a 300×600 unit next to the player on wide viewports. Hidden entirely on mobile rather than squeezed in — a cramped mobile sidebar ad hurts more than it earns.
- **Zone C — In-feed native** (home + category grid pages): a native in-feed ad unit inserted every 8–10 channel cards in the grid, styled to match card dimensions. This is Google's recommended format specifically for grid/feed layouts.
- **Zone D — Anchor ad** (mobile only, all pages): Google's auto anchor/sticky format, bottom of screen. Never overlapping the video player or its controls.

**Hard rules to bake in:**
- No ad may overlap or sit within the embedded player itself (violates AdSense policy on obscuring content and risks invalid-click issues from accidental taps).
- Total ad density stays reasonable — never more than 3 ad units visible in a single viewport at once.
- All ad zones are toggleable from `site_settings` in case a page needs to go ad-free (e.g. before AdSense approval).

---

## 6. Admin panel (`/admin`)

Simple password-gated (single admin password via env var is fine for v1 — no need for full user auth system) page listing all channels in a table. Click a channel → edit form with:

- Name, category, province
- Channel description (the text shown under the player)
- SEO title, SEO description (the fields for search/social)
- Embed type + embed source
- Status (active / broken / needs_review)
- Featured toggle

Save button writes directly to Supabase. This is intentionally simple — no rich text editor, no preview pane needed for v1 — just plain text fields that map 1:1 to the database columns, so Geaps can update any channel's info or SEO copy in under a minute without touching code.

---

## 7. Design system — light theme, white background

Following a light/editorial direction (not a generic template):

- **Background**: warm off-white `#FAF8F4` for page background, pure white `#FFFFFF` for cards/surfaces — gives white "space" without feeling sterile
- **Accent — primary**: deep cobalt blue `#1E3A8A` (used for the "EN VIVO" badge outline, links, category active state) — nods to Caribbean sky/ocean without being a literal flag color
- **Accent — live indicator**: warm coral-red `#E63946`, used only for the pulsing "EN VIVO" dot and live badges — keeps the "live" signal visually distinct from everything else on the page
- **Text**: near-black `#1A1A1A` for headings, warm gray `#5C5850` for body/secondary text
- **Typography**: a confident condensed sans for channel names and headings (e.g. Archivo or Barlow Condensed — broadcast-graphics energy without going full "breaking news" cliché), paired with a clean readable sans for body/description text (e.g. Inter or Public Sans)
- **Cards**: soft shadow, 12px radius, logo + name + live badge — no heavy borders, let whitespace do the separating
- **Signature element**: the live indicator itself — a small pulsing dot animation next to "EN VIVO" text, used consistently across every card and every channel page header, so the whole site has one recognizable "this is playing right now" motif

Fully responsive down to mobile. Visible keyboard focus states on all interactive elements.

---

## 8. Build order

1. Supabase schema + seed from `dr-tv-working-list.csv`
2. Home page + category grid + channel cards
3. Channel detail page with player component (all 3 embed types + fallback)
4. SEO metadata + JSON-LD per page type
5. AdSense zones (can ship with placeholder/house ads until AdSense account is approved)
6. Admin panel
7. Manually process `dr-tv-needs-review-list.csv` (28 channels) and add confirmed ones via the admin panel once built
