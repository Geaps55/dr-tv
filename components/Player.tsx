import type { Channel } from "@/lib/types";
import { parseEmbed } from "@/lib/embed";
import { HlsPlayer } from "./HlsPlayer";
import { IframePlayer } from "./IframePlayer";

export function Player({ channel }: { channel: Channel }) {
  const embed = parseEmbed(channel.embed_source, channel.embed_type);

  switch (embed.kind) {
    case "hls":
      return <HlsPlayer src={embed.url} />;
    case "youtube-channel":
    case "youtube-video":
      return (
        <IframePlayer
          src={embed.iframeUrl}
          title={`${channel.name} en vivo`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        />
      );
    case "facebook":
      return (
        <IframePlayer
          src={embed.iframeUrl}
          title={`${channel.name} en vivo`}
        />
      );
    case "iframe":
      return (
        <IframePlayer
          src={embed.iframeUrl}
          title={`${channel.name} en vivo`}
        />
      );
    case "youtube-link":
    case "link":
      return <FallbackCard channel={channel} url={embed.url} />;
  }
}

export function FallbackCard({ channel, url }: { channel: Channel; url: string }) {
  const target = url || channel.fallback_url || "#";
  return (
    <div className="aspect-video w-full flex flex-col items-center justify-center bg-surface border border-black/5 rounded-lg text-center px-6">
      <p className="text-muted text-sm mb-3">
        Este canal transmite en su propio sitio.
      </p>
      <a
        href={target}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-full bg-cobalt text-white px-5 py-2 text-sm font-semibold no-underline hover:bg-cobalt/90"
      >
        Ver en {channel.name} →
      </a>
    </div>
  );
}

// Small text link shown under every player as a belt-and-suspenders fallback,
// since cross-origin iframes can silently render "unavailable" without firing
// any error event we can detect.
export function PlayerFallbackLink({ channel }: { channel: Channel }) {
  const url = channel.fallback_url;
  if (!url) return null;
  return (
    <p className="mt-2 text-xs text-muted">
      ¿No carga?{" "}
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-cobalt">
        Ver en el sitio oficial de {channel.name}
      </a>
    </p>
  );
}
