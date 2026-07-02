// AdSense zones. All zones render as a labeled placeholder in dev (no AdSense
// client ID configured) so layouts stay debuggable. In production with a client
// ID set in site_settings, they emit real <ins class="adsbygoogle"> slots.
//
// Slot IDs below are placeholders — Geaps replaces them with real slot IDs
// after creating each unit in AdSense (or leaves them for house/auto ads).

"use client";

import { useEffect } from "react";

type ZoneProps = { clientId: string; slot?: string };

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

function pushAd() {
  if (typeof window === "undefined") return;
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch {
    /* AdSense not loaded yet — the script tag in root layout will retry on next nav */
  }
}

function AdSlot({
  clientId,
  slot,
  format = "auto",
  layout,
  layoutKey,
  responsive = true,
  className = "",
  minHeight = 100,
}: ZoneProps & {
  format?: string;
  layout?: string;
  layoutKey?: string;
  responsive?: boolean;
  className?: string;
  minHeight?: number;
}) {
  useEffect(() => {
    pushAd();
  }, []);

  if (!clientId) return <PlaceholderAd label="Ad zone (unconfigured)" minHeight={minHeight} />;

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block", minHeight }}
      data-ad-client={clientId}
      data-ad-slot={slot ?? ""}
      data-ad-format={format}
      data-ad-layout={layout}
      data-ad-layout-key={layoutKey}
      data-full-width-responsive={responsive ? "true" : undefined}
    />
  );
}

function PlaceholderAd({ label, minHeight = 100 }: { label: string; minHeight?: number }) {
  return (
    <div
      className="w-full rounded-lg border border-dashed border-black/15 bg-white/60 flex items-center justify-center text-xs text-muted uppercase tracking-wide"
      style={{ minHeight }}
    >
      {label}
    </div>
  );
}

// Zone A — in-article, on channel pages, after the description.
export function InArticleAd({ clientId }: { clientId: string }) {
  return (
    <div className="my-8">
      <AdSlot
        clientId={clientId}
        slot="0000000001"
        format="fluid"
        layout="in-article"
        minHeight={120}
      />
    </div>
  );
}

// Zone B — desktop sidebar 300x600 on channel pages.
export function SidebarAd({ clientId }: { clientId: string }) {
  if (!clientId) {
    return (
      <div className="hidden lg:block w-[300px]">
        <PlaceholderAd label="Sidebar 300×600 (unconfigured)" minHeight={600} />
      </div>
    );
  }
  return (
    <div className="hidden lg:block">
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: 300, height: 600 }}
        data-ad-client={clientId}
        data-ad-slot="0000000002"
      />
      <SidebarAdMount />
    </div>
  );
}

function SidebarAdMount() {
  useEffect(() => {
    pushAd();
  }, []);
  return null;
}

// Zone C — in-feed native, inserted between grid cards on home/category pages.
export function InFeedNativeAd({ clientId }: { clientId: string }) {
  return (
    <AdSlot
      clientId={clientId}
      slot="0000000003"
      format="fluid"
      layoutKey="-6t+ed+2i-1n-4w"
      className="rounded-card"
      minHeight={140}
    />
  );
}

// Zone D — mobile-only sticky anchor. Rendered from root layout.
export function AnchorAd({ clientId }: { clientId: string }) {
  useEffect(() => {
    if (!clientId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: clientId,
        enable_page_level_ads: true,
        overlays: { bottom: true },
      });
    } catch {
      /* ignore */
    }
  }, [clientId]);
  return null;
}
