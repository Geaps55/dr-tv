// AdSense zones. All zones render as a labeled placeholder in dev (no AdSense
// client ID configured) so layouts stay debuggable. In production with a client
// ID set in site_settings, they emit real <ins class="adsbygoogle"> slots.
//
// Slot IDs below are placeholders — Geaps replaces them with real slot IDs
// after creating each unit in AdSense (or leaves them for house/auto ads).

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type ZoneProps = { clientId: string; slot?: string };

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    __adsSuppressed?: boolean;
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

// Zone D — mobile-only sticky manual anchor slot. Renders a real
// <ins class="adsbygoogle"> unit fixed to the bottom of mobile viewports,
// respecting the AdsSuppressor kill switch and the ad-policy route filter.
// Page-level Auto Ads is deliberately NOT used here — AdSense flagged the
// enable_page_level_ads directive as placing ads on behavioral/no-content
// screens. Manual slot only.
export function AnchorAd({ clientId, slot }: { clientId: string; slot?: string }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const suppressed =
    typeof window !== "undefined" && window.__adsSuppressed;

  useEffect(() => {
    if (!clientId || isAdmin || suppressed) return;
    pushAd();
  }, [clientId, isAdmin, suppressed, pathname]);

  if (!clientId || isAdmin || suppressed || !slot) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden bg-white/95 backdrop-blur border-t border-black/10">
      <ins
        className="adsbygoogle block"
        style={{ display: "block", width: "100%", height: 50 }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
