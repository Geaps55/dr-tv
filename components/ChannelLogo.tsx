import type { Channel } from "@/lib/types";

// Fallback wordmark shown when a channel has no logo_url (which is currently all of them
// on first seed — logos will be added by hand via the admin panel later).
export function ChannelLogo({ channel, size = "md" }: { channel: Channel; size?: "sm" | "md" | "lg" }) {
  const initials = channel.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const cls =
    size === "lg"
      ? "h-16 w-16 text-2xl"
      : size === "sm"
        ? "h-8 w-8 text-[10px]"
        : "h-12 w-12 text-sm";

  if (channel.logo_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={channel.logo_url}
        alt={`${channel.name} logo`}
        className={`${cls} rounded-lg object-contain bg-white`}
      />
    );
  }

  return (
    <div
      className={`${cls} flex items-center justify-center rounded-lg bg-cobalt/8 text-cobalt font-display font-bold`}
      aria-hidden
    >
      {initials}
    </div>
  );
}
