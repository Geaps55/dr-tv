"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __adsSuppressed?: boolean;
    adsbygoogle?: unknown[];
  }
}

// Client-side kill switch. Mounted from pages we cannot gate server-side
// (notably not-found.tsx, whose URL is arbitrary and can't be identified in
// middleware). Removes the loaded AdSense script and neuters adsbygoogle.push
// so Auto Ads cannot place an anchor / vignette on this render.
export function AdsSuppressor() {
  useEffect(() => {
    window.__adsSuppressed = true;
    document
      .querySelectorAll('script[src*="adsbygoogle.js"]')
      .forEach((el) => el.remove());
    window.adsbygoogle = { push: () => 0 } as unknown as unknown[];
    return () => {
      window.__adsSuppressed = false;
    };
  }, []);
  return null;
}
