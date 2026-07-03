import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export const metadata = {
  title: { absolute: "Página no encontrada — DR TV" },
  description:
    "La página que buscas no está disponible. Explora las categorías del directorio DR TV para encontrar canales dominicanos en vivo.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <article className="max-w-3xl mx-auto py-8">
      <p className="text-sm uppercase tracking-wider text-cobalt mb-2">Error 404</p>
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight">
        No encontramos esa página
      </h1>
      <p className="text-lg text-muted mt-3">
        Puede que el canal que buscabas haya cambiado de nombre, que el enlace
        esté desactualizado, o simplemente que la dirección tenga un error.
      </p>

      <div className="mt-8 prose prose-neutral max-w-none">
        <h2 className="font-display text-2xl text-ink">¿Qué puedes hacer ahora?</h2>
        <p className="text-ink/90 leading-relaxed">
          DR TV es un directorio de canales dominicanos en vivo con más de un
          centenar de señales activas. Si buscabas un canal específico, es
          probable que siga estando en el catálogo bajo un nombre ligeramente
          diferente, o dentro de una de las categorías siguientes. Te
          recomendamos empezar por la página de inicio, donde puedes filtrar
          y buscar por nombre.
        </p>
        <p className="text-ink/90 leading-relaxed">
          Si sospechas que un canal fue retirado por decisión de la cadena, o
          notaste que faltaba desde hace tiempo, escríbenos desde la página de{" "}
          <Link href="/contacto">Contacto</Link> con el nombre y cualquier
          detalle que recuerdes; lo revisaremos y responderemos.
        </p>

        <h2 className="font-display text-2xl text-ink mt-10">Explora por categoría</h2>
        <p className="text-ink/90 leading-relaxed">
          El directorio está organizado en cinco secciones. Cada una agrupa
          los canales dominicanos que comparten un tipo de programación:
        </p>
      </div>

      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose">
        {CATEGORIES.map((c) => (
          <li key={c.key}>
            <Link
              href={`/categoria/${c.key}`}
              className="block rounded-xl border border-black/10 bg-surface p-4 no-underline hover:border-cobalt/40 transition-colors"
            >
              <p className="font-display font-semibold text-ink">{c.label}</p>
              <p className="text-sm text-muted mt-1">{c.seoDescription}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 prose prose-neutral max-w-none">
        <h2 className="font-display text-2xl text-ink">O regresa al inicio</h2>
        <p className="text-ink/90 leading-relaxed">
          En la página principal encontrarás el buscador, el catálogo completo
          de canales activos y los canales destacados de la semana. También
          puedes ver una vista previa del canal principal directamente desde
          el reproductor de la portada.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-full bg-cobalt text-white px-5 py-2.5 font-semibold no-underline"
        >
          Ir al inicio
        </Link>
        <Link
          href="/contacto"
          className="rounded-full border border-black/15 text-ink px-5 py-2.5 font-semibold no-underline hover:bg-surface"
        >
          Reportar canal faltante
        </Link>
      </div>
    </article>
  );
}
