import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getChannelBySlug,
  getRelatedChannels,
  getSiteSettings,
  getAllChannels,
} from "@/lib/channels";
import { CATEGORY_LABELS } from "@/lib/types";
import { Player, PlayerFallbackLink } from "@/components/Player";
import { ChannelCard } from "@/components/ChannelCard";
import { LiveBadge } from "@/components/LiveBadge";
import { InArticleAd, SidebarAd } from "@/components/AdZone";
import { JsonLdScript, channelJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const channels = await getAllChannels();
  return channels.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const channel = await getChannelBySlug(params.slug);
  if (!channel) return { title: "Canal no encontrado" };
  return {
    // Bypass the layout's "%s | DR TV" template — seo_title already includes the site suffix.
    title: { absolute: channel.seo_title },
    description: channel.seo_description,
    alternates: { canonical: `/canal/${channel.slug}` },
    openGraph: {
      title: channel.seo_title,
      description: channel.seo_description,
      type: "video.other",
      images: channel.logo_url ? [channel.logo_url] : undefined,
      locale: "es_DO",
    },
    twitter: {
      card: "summary_large_image",
      title: channel.seo_title,
      description: channel.seo_description,
    },
  };
}

export default async function ChannelPage({ params }: Props) {
  const channel = await getChannelBySlug(params.slug);
  if (!channel) notFound();

  const [related, settings] = await Promise.all([
    getRelatedChannels(channel),
    getSiteSettings(),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const showSidebarAd = settings.ads_zone_b_enabled && settings.adsense_client_id;
  const showInArticleAd = settings.ads_zone_a_enabled && settings.adsense_client_id;

  return (
    <>
      <JsonLdScript data={channelJsonLd(channel, siteUrl)} />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Inicio", url: siteUrl },
          {
            name: CATEGORY_LABELS[channel.category],
            url: `${siteUrl}/categoria/${channel.category}`,
          },
          { name: channel.name, url: `${siteUrl}/canal/${channel.slug}` },
        ])}
      />

      <nav aria-label="Ruta de navegación" className="text-xs text-muted mb-4">
        <Link href="/" className="no-underline hover:underline">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href={`/categoria/${channel.category}`} className="no-underline hover:underline">
          {CATEGORY_LABELS[channel.category]}
        </Link>
        <span className="mx-2">/</span>
        <span>{channel.name}</span>
      </nav>

      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight">
            {channel.name}
          </h1>
          {channel.province && (
            <p className="mt-2 text-muted">{channel.province}</p>
          )}
        </div>
        <LiveBadge size="md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <Player channel={channel} />
          <PlayerFallbackLink channel={channel} />

          <div className="mt-6 prose prose-neutral max-w-none">
            <h2 className="font-display text-xl text-ink mb-2">Sobre {channel.name}</h2>
            <p className="text-ink/90 leading-relaxed">{channel.channel_description}</p>
          </div>

          {showInArticleAd ? <InArticleAd clientId={settings.adsense_client_id} /> : null}

          {related.length > 0 && (
            <section className="mt-10" aria-labelledby="related-heading">
              <h2 id="related-heading" className="font-display text-xl mb-4 text-ink">
                Canales relacionados
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                {related.map((c) => (
                  <ChannelCard key={c.id} channel={c} />
                ))}
              </div>
            </section>
          )}
        </div>

        {showSidebarAd ? (
          <aside>
            <SidebarAd clientId={settings.adsense_client_id} />
          </aside>
        ) : null}
      </div>
    </>
  );
}
