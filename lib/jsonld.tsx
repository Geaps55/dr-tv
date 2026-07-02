import type { Channel } from "./types";
import { CATEGORY_LABELS } from "./types";

export function channelJsonLd(channel: Channel, siteUrl: string) {
  const url = `${siteUrl.replace(/\/$/, "")}/canal/${channel.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BroadcastEvent",
    name: `${channel.name} en Vivo`,
    description: channel.channel_description,
    isLiveBroadcast: true,
    url,
    image: channel.logo_url ?? undefined,
    videoFormat: "HD",
    inLanguage: "es-DO",
    broadcastOfEvent: {
      "@type": "Event",
      name: `${channel.name} transmisión en vivo`,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      location: {
        "@type": "VirtualLocation",
        url,
      },
    },
    publisher: {
      "@type": "Organization",
      name: channel.name,
      url: channel.fallback_url ?? url,
    },
    genre: CATEGORY_LABELS[channel.category],
  };
}

export function homeJsonLd(siteUrl: string, siteTitle: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteTitle,
    description,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl.replace(/\/$/, "")}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
