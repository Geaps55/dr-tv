import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Contacto — DR TV" },
  description:
    "Escríbenos: sugerencias de canales, correcciones, solicitudes de retirada DMCA, colaboraciones o cualquier pregunta sobre el directorio DR TV.",
  alternates: { canonical: "/contacto" },
};

const CONTACT_EMAIL = "contacto@dominicanrepublictv.com";

export default function ContactoPage() {
  return (
    <article className="prose prose-neutral max-w-3xl">
      <nav aria-label="Ruta de navegación" className="text-xs text-muted mb-4 not-prose">
        <Link href="/" className="no-underline hover:underline">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span>Contacto</span>
      </nav>

      <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight">
        Contacto
      </h1>
      <p className="text-lg text-muted mt-3">
        Escríbenos por correo. Leemos todos los mensajes.
      </p>

      <p className="text-ink/90 leading-relaxed mt-6">
        La mejor forma de comunicarte con el equipo de DR TV es por correo
        electrónico. No usamos formularios web para evitar spam y para
        asegurarnos de que tu mensaje llegue directamente a nuestra bandeja.
      </p>

      <div className="not-prose my-8 rounded-xl border border-black/10 bg-surface p-6">
        <p className="text-sm text-muted uppercase tracking-wider">Correo electrónico</p>
        <p className="mt-2">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-display text-2xl text-cobalt no-underline hover:underline break-all"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>

      <h2 className="font-display text-2xl text-ink mt-10">Qué tipo de mensajes recibimos</h2>
      <p className="text-ink/90 leading-relaxed">Escríbenos para:</p>
      <ul className="text-ink/90 leading-relaxed">
        <li>
          <strong>Sugerir un canal nuevo:</strong> si conoces una señal
          dominicana que emite en vivo por internet y debería estar en el
          directorio, mándanos el nombre y el enlace oficial.
        </li>
        <li>
          <strong>Reportar un canal caído:</strong> si un canal no reproduce o
          la señal se ve interrumpida constantemente, avísanos con la URL de la
          página en DR TV y qué navegador/dispositivo estás usando.
        </li>
        <li>
          <strong>Corregir información:</strong> ¿el nombre, la provincia, la
          categoría o la descripción tienen un error? Mándanos la corrección y
          la fuente.
        </li>
        <li>
          <strong>Solicitudes DMCA o de retirada:</strong> si representas a
          una cadena y necesitas modificar o eliminar un enlace, indícanoslo
          siguiendo los datos descritos en nuestros{" "}
          <Link href="/terminos">Términos de Uso</Link>.
        </li>
        <li>
          <strong>Colaboraciones y prensa:</strong> propuestas de contenido
          editorial, entrevistas, colaboraciones de medios.
        </li>
        <li>
          <strong>Preguntas legales o de privacidad:</strong> consultas sobre
          nuestra <Link href="/privacidad">Política de Privacidad</Link> o
          sobre el manejo de datos.
        </li>
      </ul>

      <h2 className="font-display text-2xl text-ink mt-10">Tiempo de respuesta</h2>
      <p className="text-ink/90 leading-relaxed">
        Somos un equipo pequeño, así que los tiempos de respuesta pueden
        variar. En general procuramos responder los mensajes en un plazo de
        una a dos semanas. Las solicitudes de retirada de contenido y los
        reportes de canales caídos se procesan con prioridad.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">Cómo ayudarnos a ayudarte</h2>
      <p className="text-ink/90 leading-relaxed">
        Para procesar tu mensaje más rápido, incluye siempre que sea posible:
      </p>
      <ul className="text-ink/90 leading-relaxed">
        <li>
          Un asunto claro y breve (por ejemplo: "Canal caído: Color Visión" o
          "Sugerencia de canal: TV Higüey").
        </li>
        <li>
          La URL exacta de la página del canal en DR TV, si tu mensaje se
          refiere a un canal existente.
        </li>
        <li>
          Capturas de pantalla si estás reportando un problema técnico.
        </li>
        <li>
          Detalles del dispositivo y navegador cuando aplique (por ejemplo:
          "Chrome en iPhone, no carga el reproductor").
        </li>
      </ul>

      <p className="text-ink/90 leading-relaxed mt-8">
        Gracias por ayudarnos a mantener DR TV como un directorio útil, al
        día y confiable para toda la comunidad dominicana.
      </p>
    </article>
  );
}
