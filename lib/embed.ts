// Parse the raw embed_source stored on each channel into a normalized shape
// the player component knows how to render. Kept in a pure module so both
// server and client code can call it without hydration mismatches.

export type ParsedEmbed =
  | { kind: "youtube-channel"; channelId: string; iframeUrl: string }
  | { kind: "youtube-video"; videoId: string; iframeUrl: string }
  | { kind: "youtube-link"; url: string }
  | { kind: "hls"; url: string }
  | { kind: "facebook"; url: string; iframeUrl: string }
  | { kind: "iframe"; iframeUrl: string }
  | { kind: "link"; url: string };

const YT_CHANNEL_RE = /(?:youtube\.com\/channel\/)(UC[\w-]{20,})/i;
const YT_EMBED_RE = /(?:youtube\.com\/embed\/)([\w-]{6,})/i;
const YT_SHORT_RE = /(?:youtu\.be\/)([\w-]{6,})/i;
const YT_HANDLE_RE = /youtube\.com\/(@[\w.-]+|c\/[\w.-]+|user\/[\w.-]+)/i;

export function parseEmbed(source: string, kind: string): ParsedEmbed {
  const raw = (source ?? "").trim();

  if (kind === "hls") {
    return { kind: "hls", url: raw };
  }

  // Raw iframe embed — third-party player pages that expect their URL loaded
  // directly in an <iframe>. Used for stations without a public HLS or YouTube
  // feed (e.g. Cielo TV, Guaymate TV, several vivalivetv-hosted regionals).
  if (kind === "iframe") {
    return { kind: "iframe", iframeUrl: raw };
  }

  if (kind === "facebook") {
    return {
      kind: "facebook",
      url: raw,
      iframeUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        raw,
      )}&show_text=false&autoplay=true&mute=1`,
    };
  }

  if (kind === "youtube") {
    const channelMatch = raw.match(YT_CHANNEL_RE);
    if (channelMatch) {
      const channelId = channelMatch[1];
      return {
        kind: "youtube-channel",
        channelId,
        iframeUrl: `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1`,
      };
    }
    const embedMatch = raw.match(YT_EMBED_RE);
    if (embedMatch) {
      const id = embedMatch[1].split("?")[0].split("u0026")[0];
      return {
        kind: "youtube-video",
        videoId: id,
        iframeUrl: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&rel=0`,
      };
    }
    const shortMatch = raw.match(YT_SHORT_RE);
    if (shortMatch) {
      const id = shortMatch[1];
      return {
        kind: "youtube-video",
        videoId: id,
        iframeUrl: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&rel=0`,
      };
    }
    // Handle-based URLs (/@handle, /c/name, /user/name) can't be embedded as an
    // iframe without a resolved channel ID — send visitors to YouTube instead.
    const handleMatch = raw.match(YT_HANDLE_RE);
    if (handleMatch) {
      return { kind: "youtube-link", url: `https://www.youtube.com/${handleMatch[1]}/live` };
    }
    return { kind: "youtube-link", url: raw.startsWith("http") ? raw : `https://${raw}` };
  }

  // link_only or unknown
  return { kind: "link", url: raw.startsWith("http") ? raw : `https://${raw}` };
}
