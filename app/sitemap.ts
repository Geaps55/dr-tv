import type { MetadataRoute } from "next";
import { getAllChannels } from "@/lib/channels";
import { CATEGORIES } from "@/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const now = new Date();
  const channels = await getAllChannels();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/sobre`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contacto`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terminos`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...CATEGORIES.map((c) => ({
      url: `${base}/categoria/${c.key}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...channels.map((c) => ({
      url: `${base}/canal/${c.slug}`,
      lastModified: new Date(c.updated_at),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];
}
