import {
  getAllChannels,
  getChannelBySlug,
  getFeaturedChannels,
  getSiteSettings,
} from "@/lib/channels";
import { FilterableGrid } from "@/components/CategoryFilter";
import { FeaturedChannelCard } from "@/components/FeaturedChannelCard";
import { HeroPlayer } from "@/components/HeroPlayer";
import { InFeedNativeAd } from "@/components/AdZone";
import type { Metadata } from "next";

// The "default TV" that plays in the hero — RTVD (CERTV Canal 4), the state
// broadcaster. Change the slug here to feature a different channel.
const HERO_CHANNEL_SLUG = "certv-canal-4";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.site_title,
    description: settings.default_seo_description,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [channels, featured, settings, hero] = await Promise.all([
    getAllChannels(),
    getFeaturedChannels(),
    getSiteSettings(),
    getChannelBySlug(HERO_CHANNEL_SLUG),
  ]);

  return (
    <>
      <section className="mb-8">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight">
          {settings.site_title}
        </h1>
        <p className="mt-3 text-lg text-muted max-w-2xl">{settings.site_tagline}</p>
      </section>

      {hero && <HeroPlayer channel={hero} />}

      {featured.length > 0 && (
        <section className="mb-14" aria-labelledby="featured-heading">
          <div className="flex items-baseline justify-between mb-5">
            <h2 id="featured-heading" className="font-display text-2xl text-ink">
              Canales destacados
            </h2>
            <span className="text-xs text-muted uppercase tracking-wider">
              Diáspora
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {featured.map((c) => (
              <FeaturedChannelCard key={c.id} channel={c} />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="all-heading">
        <h2 id="all-heading" className="font-display text-xl mb-4 text-ink">
          Todos los canales
        </h2>
        <FilterableGrid channels={channels} />
        {settings.ads_zone_c_enabled && settings.adsense_client_id ? (
          <div className="mt-8">
            <InFeedNativeAd clientId={settings.adsense_client_id} />
          </div>
        ) : null}
      </section>
    </>
  );
}
