"use client";

import { useEffect, useState } from "react";

// Cross-origin iframes suppress `onerror` in every browser, and successful
// `onload` fires even when the embedded page renders "video unavailable".
// So we rely on a mount timeout as a soft signal: if `load` never fires within
// N seconds, assume the embed is broken and show the fallback.
export function IframePlayer({
  src,
  title,
  allow = "autoplay; encrypted-media; picture-in-picture",
  timeoutMs = 6000,
  onFail,
}: {
  src: string;
  title: string;
  allow?: string;
  timeoutMs?: number;
  onFail?: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const timer = setTimeout(() => {
      if (!loaded) {
        setFailed(true);
        onFail?.();
      }
    }, timeoutMs);
    return () => clearTimeout(timer);
  }, [loaded, timeoutMs, onFail]);

  if (failed) {
    return (
      <div className="aspect-video w-full flex items-center justify-center bg-ink text-white/80 rounded-lg">
        <p className="text-sm">No se pudo cargar la transmisión.</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full bg-ink rounded-lg overflow-hidden">
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow={allow}
        allowFullScreen
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          onFail?.();
        }}
      />
    </div>
  );
}
