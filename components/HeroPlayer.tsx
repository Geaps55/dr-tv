import Link from "next/link";
import type { Channel } from "@/lib/types";
import { Player, PlayerFallbackLink } from "./Player";
import { LiveBadge } from "./LiveBadge";

// Landing hero. Renders a full-width live player for the "default" channel
// (currently CERTV Canal 4 — the state broadcaster's RTVD feed) so visitors
// see something playing the moment they arrive, before the directory grid.
export function HeroPlayer({ channel }: { channel: Channel }) {
  return (
    <section
      className="mb-12 rounded-card bg-ink overflow-hidden shadow-card"
      aria-labelledby="hero-heading"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto]">
        <div>
          <Player channel={channel} />
        </div>
        <div className="p-6 lg:p-8 lg:w-80 flex flex-col justify-between bg-ink text-white">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <LiveBadge />
              <span className="text-xs uppercase tracking-wider text-white/60">
                Ahora en vivo
              </span>
            </div>
            <h2 id="hero-heading" className="font-display text-3xl leading-tight">
              {channel.name}
            </h2>
            <p className="mt-3 text-sm text-white/70">
              {channel.channel_description}
            </p>
          </div>
          <div className="mt-6">
            <Link
              href={`/canal/${channel.slug}`}
              className="inline-flex items-center rounded-full bg-white text-ink px-4 py-2 text-sm font-semibold no-underline hover:bg-white/90"
            >
              Ver página del canal →
            </Link>
            <div className="text-white/70">
              <PlayerFallbackLink channel={channel} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
