import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, type Category } from "@/lib/types";
import { getChannelsByCategory, getSiteSettings } from "@/lib/channels";
import { ChannelCard } from "@/components/ChannelCard";
import { InFeedNativeAd } from "@/components/AdZone";
import { JsonLdScript, breadcrumbJsonLd } from "@/lib/jsonld";

type Props = { params: { category: string } };

function findCategory(key: string) {
  return CATEGORIES.find((c) => c.key === key);
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = findCategory(params.category);
  if (!cat) return { title: "Categoría no encontrada" };
  return {
    title: { absolute: cat.seoTitle },
    description: cat.seoDescription,
    alternates: { canonical: `/categoria/${cat.key}` },
    openGraph: {
      title: cat.seoTitle,
      description: cat.seoDescription,
      type: "website",
      locale: "es_DO",
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const cat = findCategory(params.category);
  if (!cat) notFound();

  const [channels, settings] = await Promise.all([
    getChannelsByCategory(cat.key as Category),
    getSiteSettings(),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const showFeedAd = settings.ads_zone_c_enabled && settings.adsense_client_id;

  // Insert an in-feed ad slot every 8 cards without cloning the grid layout —
  // we render into the same grid so the ad card stretches naturally.
  const withAds: Array<{ kind: "channel"; item: (typeof channels)[number] } | { kind: "ad"; key: string }> = [];
  channels.forEach((c, i) => {
    withAds.push({ kind: "channel", item: c });
    if (showFeedAd && (i + 1) % 8 === 0 && i < channels.length - 1) {
      withAds.push({ kind: "ad", key: `ad-${i}` });
    }
  });

  return (
    <>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Inicio", url: siteUrl },
          { name: cat.label, url: `${siteUrl}/categoria/${cat.key}` },
        ])}
      />

      <nav aria-label="Ruta de navegación" className="text-xs text-muted mb-4">
        <Link href="/" className="no-underline hover:underline">Inicio</Link>
        <span className="mx-2">/</span>
        <span>{cat.label}</span>
      </nav>

      <section className="mb-8">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight">
          {cat.label}
        </h1>
        <p className="mt-3 text-lg text-muted max-w-2xl">{cat.seoDescription}</p>
      </section>

      {channels.length === 0 ? (
        <p className="text-muted py-12 text-center">No hay canales activos en esta categoría todavía.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {withAds.map((entry) =>
            entry.kind === "channel" ? (
              <ChannelCard key={entry.item.id} channel={entry.item} />
            ) : (
              <div key={entry.key} className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5">
                <InFeedNativeAd clientId={settings.adsense_client_id} />
              </div>
            ),
          )}
        </div>
      )}
    </>
  );
}
