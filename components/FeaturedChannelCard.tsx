import Link from "next/link";
import type { Channel } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { LiveBadge } from "./LiveBadge";
import { ChannelLogo } from "./ChannelLogo";

// Larger, roomier card used in the featured row on the home page. Distinct
// from the small ChannelCard used in the dense grid below — bigger padding,
// bigger name, and a top accent bar so the row reads as a separate band.
export function FeaturedChannelCard({ channel }: { channel: Channel }) {
  return (
    <Link
      href={`/canal/${channel.slug}`}
      className="group relative block rounded-card bg-surface shadow-card hover:shadow-cardHover transition-shadow no-underline overflow-hidden"
    >
      <div className="h-1 w-full bg-live" aria-hidden />
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <ChannelLogo channel={channel} size="lg" />
          <LiveBadge />
        </div>
        <h3 className="mt-5 font-display text-2xl leading-tight text-ink">
          {channel.name}
        </h3>
        <p className="mt-1.5 text-sm text-muted">
          {channel.province || CATEGORY_LABELS[channel.category]}
        </p>
      </div>
    </Link>
  );
}
