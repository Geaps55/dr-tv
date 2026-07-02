import Link from "next/link";
import type { Channel } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { LiveBadge } from "./LiveBadge";
import { ChannelLogo } from "./ChannelLogo";

export function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <Link
      href={`/canal/${channel.slug}`}
      className="group block rounded-card bg-surface shadow-card hover:shadow-cardHover transition-shadow no-underline overflow-hidden"
    >
      <div className="h-1 w-full bg-live" aria-hidden />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <ChannelLogo channel={channel} size="md" />
          <LiveBadge />
        </div>
        <div className="mt-3">
          <h3 className="font-display text-ink text-lg leading-tight">
            {channel.name}
          </h3>
          <p className="mt-1 text-xs text-muted">
            {channel.province || CATEGORY_LABELS[channel.category]}
          </p>
        </div>
      </div>
    </Link>
  );
}
