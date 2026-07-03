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

      <section className="my-12 prose prose-neutral max-w-3xl" aria-labelledby="intro-heading">
        <h2 id="intro-heading" className="font-display text-2xl text-ink">
          Televisión dominicana en vivo, en un solo lugar
        </h2>
        <p className="text-ink/90 leading-relaxed">
          DR TV es un directorio abierto de canales de televisión de la República
          Dominicana que emiten en directo por internet. Reunimos en una sola
          página las señales nacionales, regionales, deportivas, de
          entretenimiento y cristianas —desde las grandes cadenas de Santo
          Domingo y Santiago hasta las estaciones locales de provincias como
          Puerto Plata, La Vega, Barahona o San Pedro de Macorís— para que
          puedas ver la tele dominicana sin instalar aplicaciones, sin crear
          cuentas y sin depender de canales de YouTube que se caen a los pocos
          días.
        </p>
        <p className="text-ink/90 leading-relaxed">
          Cada canal tiene su propia página con reproductor integrado, una
          breve descripción de qué transmite y de dónde viene, un enlace de
          respaldo por si la señal principal falla, y sugerencias de canales
          relacionados. Puedes filtrar el listado por categoría desde el menú
          superior, o usar el buscador para saltar directo al que quieres ver.
        </p>
      </section>

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
          <p className="text-muted max-w-2xl mb-6 leading-relaxed">
            Estos son los canales que más buscan los dominicanos en el
            exterior: señales de referencia para mantenerte al día con lo que
            pasa en el país, ya estés en Nueva York, Madrid, San Juan o
            cualquier parte del mundo.
          </p>
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
        <p className="text-muted max-w-2xl mb-4 leading-relaxed">
          Listado completo de los canales dominicanos disponibles ahora mismo
          en DR TV. Usa el buscador o filtra por categoría para encontrar el
          que buscas.
        </p>
        <FilterableGrid channels={channels} />
        {settings.ads_zone_c_enabled && settings.adsense_client_id ? (
          <div className="mt-8">
            <InFeedNativeAd clientId={settings.adsense_client_id} />
          </div>
        ) : null}
      </section>

      <section className="mt-16 prose prose-neutral max-w-3xl" aria-labelledby="how-heading">
        <h2 id="how-heading" className="font-display text-2xl text-ink">
          Cómo funciona DR TV
        </h2>
        <p className="text-ink/90 leading-relaxed">
          Todas las señales que ves aquí son{" "}
          <strong>transmisiones públicas oficiales</strong> puestas a
          disposición por las propias cadenas dominicanas en sus sitios web y
          canales oficiales. DR TV no aloja el video: solo enlaza a las
          transmisiones existentes y las presenta en un formato ordenado y
          navegable. Cada canal conserva los derechos completos sobre su
          contenido, y cualquier cadena que quiera modificar o remover su
          enlace puede escribirnos desde la página de{" "}
          <a href="/contacto">Contacto</a>.
        </p>
        <p className="text-ink/90 leading-relaxed">
          Verificamos los enlaces con regularidad y marcamos como inactivos
          los que dejan de responder, para que no pierdas tiempo con canales
          caídos. Cuando encontramos una señal nueva o mejor, la sumamos —el
          catálogo crece constantemente. Si conoces un canal dominicano que
          debería estar aquí, o notas que uno no funciona,{" "}
          <a href="/contacto">háznoslo saber</a>.
        </p>
        <h3 className="font-display text-xl text-ink mt-8">Para quién es DR TV</h3>
        <p className="text-ink/90 leading-relaxed">
          Pensamos este sitio principalmente para la{" "}
          <strong>diáspora dominicana</strong>: los dominicanos que viven
          fuera del país y quieren mantener el contacto con la televisión
          local, con las noticias del día, con los partidos de LIDOM, con la
          programación matutina, con los canales cristianos de siempre y con
          las voces regionales de su provincia. Pero también es útil para
          quien esté en la isla y prefiera ver la tele desde el navegador en
          lugar de la caja, o para quien busque un canal específico sin
          instalar más apps.
        </p>
        <h3 className="font-display text-xl text-ink mt-8">Categorías disponibles</h3>
        <ul className="text-ink/90 leading-relaxed">
          <li>
            <strong>Nacionales y Noticias:</strong> las cadenas grandes de
            alcance nacional, con noticias, opinión y programación matutina.
          </li>
          <li>
            <strong>Deportes:</strong> canales dedicados al béisbol, baloncesto,
            fútbol y deportes locales dominicanos.
          </li>
          <li>
            <strong>Entretenimiento:</strong> música, farándula, cine, series y
            variedades dominicanas.
          </li>
          <li>
            <strong>Regionales:</strong> señales locales de provincias
            específicas —Puerto Plata, La Vega, Barahona, San Pedro de
            Macorís, entre otras.
          </li>
          <li>
            <strong>Cristianos:</strong> canales cristianos, evangélicos y
            católicos dominicanos con predicación y música religiosa.
          </li>
        </ul>
      </section>
    </>
  );
}
