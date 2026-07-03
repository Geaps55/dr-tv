import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Sobre DR TV — Directorio de canales dominicanos en vivo" },
  description:
    "Qué es DR TV, por qué existe y cómo curamos el directorio de canales de televisión dominicanos que emiten en vivo por internet.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <article className="prose prose-neutral max-w-3xl">
      <nav aria-label="Ruta de navegación" className="text-xs text-muted mb-4 not-prose">
        <Link href="/" className="no-underline hover:underline">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span>Sobre DR TV</span>
      </nav>

      <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight">
        Sobre DR TV
      </h1>
      <p className="text-lg text-muted mt-3">
        Un directorio abierto, gratuito y sin cuentas, para ver la televisión
        dominicana en vivo desde cualquier navegador.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">Qué es DR TV</h2>
      <p className="text-ink/90 leading-relaxed">
        DR TV es un directorio de canales de televisión de la República
        Dominicana que emiten en directo por internet. Reunimos las señales
        públicas oficiales de cadenas nacionales, regionales, deportivas, de
        entretenimiento y cristianas en una sola página, organizadas por
        categoría y con reproductor integrado. Nuestro objetivo es simple:
        que puedas ver la tele dominicana sin fricción —sin instalar
        aplicaciones, sin crear cuentas y sin depender de canales de terceros
        que se caen a los pocos días.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">Por qué existe este sitio</h2>
      <p className="text-ink/90 leading-relaxed">
        Muchos dominicanos que viven fuera del país —en Estados Unidos, España,
        Puerto Rico, Italia, Canadá y otros lugares— buscan constantemente cómo
        ver los canales de casa. La misma búsqueda la hacen miles de personas
        cada día, y la respuesta suele ser una mezcla de canales de YouTube que
        no duran, aplicaciones piratas con anuncios agresivos, o transmisiones
        de dudosa procedencia. Nosotros creemos que hay una forma mejor:
        enlazar directamente a las transmisiones oficiales que las propias
        cadenas dominicanas ya publican en sus sitios web, presentarlas de
        forma ordenada, y mantenerlas verificadas.
      </p>
      <p className="text-ink/90 leading-relaxed">
        El resultado es DR TV: un punto de partida único para la televisión
        dominicana en vivo, útil tanto para la diáspora como para quien esté
        en la isla y prefiera ver la tele desde el navegador.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">Cómo curamos el catálogo</h2>
      <p className="text-ink/90 leading-relaxed">
        Cada canal en DR TV pasa por un proceso sencillo antes de aparecer en
        el listado público:
      </p>
      <ol className="text-ink/90 leading-relaxed">
        <li>
          <strong>Identificación:</strong> localizamos la transmisión oficial
          de la cadena en su sitio web, redes sociales verificadas o app
          oficial.
        </li>
        <li>
          <strong>Verificación técnica:</strong> comprobamos que la señal
          responde y se reproduce correctamente. Cuando la fuente principal
          falla, buscamos una alternativa oficial como respaldo.
        </li>
        <li>
          <strong>Categorización:</strong> asignamos el canal a la categoría
          que mejor describe su programación (nacional, deportes,
          entretenimiento, regional o cristiano) y, si aplica, a una provincia.
        </li>
        <li>
          <strong>Descripción:</strong> escribimos una breve nota que ayuda al
          usuario a entender qué transmite el canal y de dónde viene.
        </li>
        <li>
          <strong>Monitoreo continuo:</strong> revisamos periódicamente los
          enlaces y marcamos como inactivos los que dejan de responder, para
          que no pierdas tiempo con canales caídos.
        </li>
      </ol>

      <h2 className="font-display text-2xl text-ink mt-10">Contenido y derechos</h2>
      <p className="text-ink/90 leading-relaxed">
        DR TV no aloja, retransmite ni almacena ningún video. Todas las
        señales que ves en el sitio son transmisiones públicas puestas a
        disposición por las propias cadenas dominicanas en sus canales
        oficiales; nosotros solo enlazamos a ellas y las presentamos en un
        formato navegable. Cada canal conserva íntegramente los derechos sobre
        su contenido, su marca y su programación.
      </p>
      <p className="text-ink/90 leading-relaxed">
        Si eres representante de una cadena y quieres corregir información,
        cambiar el enlace, o solicitar la retirada de tu canal del directorio,
        puedes escribirnos en cualquier momento desde la página de{" "}
        <Link href="/contacto">Contacto</Link>. Respondemos a todas las
        solicitudes de este tipo con la mayor rapidez posible.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">Cómo se sostiene el proyecto</h2>
      <p className="text-ink/90 leading-relaxed">
        DR TV es un proyecto independiente. Para cubrir los costos de
        alojamiento y desarrollo, mostramos anuncios discretos servidos por
        Google AdSense en algunas secciones del sitio. Los anuncios nunca
        interfieren con la reproducción de los canales, y hemos diseñado la
        experiencia para que la publicidad sea lo menos intrusiva posible.
        Para más detalles sobre cómo funciona la publicidad y qué datos se
        recogen, consulta nuestra{" "}
        <Link href="/privacidad">Política de Privacidad</Link>.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">Contacto</h2>
      <p className="text-ink/90 leading-relaxed">
        ¿Falta un canal? ¿Notaste que uno no funciona? ¿Tienes una sugerencia
        o una corrección? Escríbenos desde la página de{" "}
        <Link href="/contacto">Contacto</Link> —leemos todos los mensajes.
      </p>
    </article>
  );
}
