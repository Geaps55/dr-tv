"use client";

import { useEffect, useRef, useState } from "react";

export function HlsPlayer({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Safari and iOS play HLS natively.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.play().catch(() => {/* autoplay may be blocked, user will tap play */});
      return;
    }

    let hls: import("hls.js").default | null = null;
    let cancelled = false;

    import("hls.js")
      .then((mod) => {
        if (cancelled) return;
        const Hls = mod.default;
        if (!Hls.isSupported()) {
          setError(true);
          return;
        }
        hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (data.fatal) setError(true);
        });
        video.play().catch(() => {/* ignore */});
      })
      .catch(() => setError(true));

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [src]);

  if (error) {
    return (
      <div className="aspect-video w-full flex items-center justify-center bg-ink text-white/80 rounded-lg">
        <p className="text-sm">No se pudo cargar la transmisión.</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full bg-ink rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="h-full w-full"
        autoPlay
        muted={muted}
        playsInline
        controls
        poster={poster}
      />
      {muted && (
        <button
          type="button"
          onClick={() => {
            const v = videoRef.current;
            if (v) {
              v.muted = false;
              setMuted(false);
              v.play().catch(() => {/* ignore */});
            }
          }}
          className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink shadow"
        >
          Activar sonido
        </button>
      )}
    </div>
  );
}
