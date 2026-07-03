import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { AnchorAd } from "@/components/AdZone";
import { getSiteSettings } from "@/lib/channels";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: settings.site_title,
      template: "%s | DR TV",
    },
    description: settings.default_seo_description,
    openGraph: {
      title: settings.site_title,
      description: settings.default_seo_description,
      type: "website",
      locale: "es_DO",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const adsenseId = settings.adsense_client_id;
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {adsenseId ? (
          // Plain <script> avoids next/script placement/strategy quirks —
          // renders exactly here in the server HTML, which is what AdSense's
          // verification crawler expects to find in <head>.
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body>
        <SiteHeader title={settings.site_title} />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
        <SiteFooter />
        {settings.ads_zone_d_enabled && adsenseId ? <AnchorAd clientId={adsenseId} /> : null}
      </body>
    </html>
  );
}
