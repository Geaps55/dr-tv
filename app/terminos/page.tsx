import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Términos de Uso — DR TV" },
  description:
    "Condiciones de uso del directorio DR TV: alcance del servicio, contenido de terceros, propiedad intelectual, DMCA, limitación de responsabilidad y contacto.",
  alternates: { canonical: "/terminos" },
};

const LAST_UPDATED = "3 de julio de 2026";

export default function TerminosPage() {
  return (
    <article className="prose prose-neutral max-w-3xl">
      <nav aria-label="Ruta de navegación" className="text-xs text-muted mb-4 not-prose">
        <Link href="/" className="no-underline hover:underline">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span>Términos de Uso</span>
      </nav>

      <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight">
        Términos de Uso
      </h1>
      <p className="text-sm text-muted mt-2">Última actualización: {LAST_UPDATED}</p>

      <p className="text-ink/90 leading-relaxed mt-6">
        Bienvenido a DR TV. Estos Términos de Uso regulan tu acceso y uso del
        sitio web dominicanrepublictv.com y de todos los servicios asociados.
        Al utilizar el sitio, aceptas cumplir con estos términos. Si no estás
        de acuerdo con alguna parte, te pedimos que no uses el servicio.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">1. Qué es DR TV</h2>
      <p className="text-ink/90 leading-relaxed">
        DR TV es un directorio de canales de televisión de la República
        Dominicana que emiten en directo por internet. Nuestra función es
        listar, organizar y enlazar a transmisiones públicas oficiales
        puestas a disposición por las cadenas dominicanas en sus sitios web
        y canales oficiales. No producimos, alojamos, retransmitimos ni
        almacenamos contenido de video.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">2. Uso permitido</h2>
      <p className="text-ink/90 leading-relaxed">
        Puedes usar DR TV libremente para consultar el directorio y ver los
        canales disponibles en tu dispositivo con fines personales y no
        comerciales. Al usar el sitio, te comprometes a:
      </p>
      <ul className="text-ink/90 leading-relaxed">
        <li>No usar el servicio para fines ilegales o contrarios a estos términos.</li>
        <li>
          No intentar acceder a áreas restringidas del sitio (como el panel
          de administración) sin autorización.
        </li>
        <li>
          No realizar acciones que puedan sobrecargar, deshabilitar o dañar
          el funcionamiento del sitio.
        </li>
        <li>
          No copiar, redistribuir o reutilizar el contenido editorial (textos
          descriptivos, categorías, curaduría) sin permiso previo.
        </li>
      </ul>

      <h2 className="font-display text-2xl text-ink mt-10">3. Contenido de terceros</h2>
      <p className="text-ink/90 leading-relaxed">
        Los canales enlazados en DR TV son propiedad de sus respectivas
        cadenas y sus derechos son íntegramente de ellas. DR TV se limita a
        listar y presentar enlaces a transmisiones que las propias cadenas
        han publicado como accesibles al público. La disponibilidad, calidad
        y contenido de esas transmisiones dependen exclusivamente de sus
        proveedores originales; no podemos garantizar que un canal esté
        siempre en línea ni que su programación coincida con lo esperado.
      </p>
      <p className="text-ink/90 leading-relaxed">
        Los logos, nombres, marcas comerciales y otros identificadores de
        las cadenas dominicanas mostrados en el sitio son propiedad de sus
        respectivos titulares y se utilizan con fines meramente informativos
        de identificación del canal.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">4. Propiedad intelectual de DR TV</h2>
      <p className="text-ink/90 leading-relaxed">
        El diseño del sitio, la organización del catálogo, las descripciones
        editoriales y el resto del contenido original creado por DR TV son
        propiedad del proyecto y están protegidos por las leyes de propiedad
        intelectual aplicables. No pueden reproducirse ni redistribuirse sin
        autorización.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">5. Notificaciones DMCA y retirada de canales</h2>
      <p className="text-ink/90 leading-relaxed">
        Respetamos los derechos de propiedad intelectual y respondemos a las
        notificaciones válidas de infracción de derechos de autor conforme a
        la Digital Millennium Copyright Act (DMCA) de los Estados Unidos y a
        la legislación equivalente en otras jurisdicciones.
      </p>
      <p className="text-ink/90 leading-relaxed">
        Si eres titular de derechos o representante autorizado de una cadena
        dominicana y consideras que el enlace a tu canal debe modificarse,
        actualizarse o eliminarse, escríbenos desde la página de{" "}
        <Link href="/contacto">Contacto</Link> incluyendo:
      </p>
      <ul className="text-ink/90 leading-relaxed">
        <li>Identificación del contenido o canal afectado (nombre y URL en DR TV).</li>
        <li>Prueba de que eres titular de los derechos o representante autorizado.</li>
        <li>Descripción clara de la acción solicitada (retirada, corrección, actualización).</li>
        <li>Un contacto de respuesta.</li>
      </ul>
      <p className="text-ink/90 leading-relaxed">
        Procesamos estas solicitudes con prioridad y actuaremos de buena fe
        para resolverlas rápidamente.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">6. Publicidad</h2>
      <p className="text-ink/90 leading-relaxed">
        DR TV muestra publicidad servida por Google AdSense en secciones
        específicas del sitio. No respaldamos ni controlamos el contenido de
        los anuncios individuales; su selección y presentación depende de
        los algoritmos de Google. Para más detalles sobre cómo funciona la
        publicidad y cómo controlarla, consulta nuestra{" "}
        <Link href="/privacidad">Política de Privacidad</Link>.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">7. Ausencia de garantías</h2>
      <p className="text-ink/90 leading-relaxed">
        El servicio se ofrece "tal cual" y "según disponibilidad". No
        garantizamos que el sitio esté siempre en línea, que todos los
        canales funcionen en todo momento, ni que la información sea
        completamente precisa. Hacemos todo lo razonablemente posible por
        mantener un directorio verificado y útil, pero cambios en las
        transmisiones de origen o problemas técnicos ajenos pueden causar
        interrupciones.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">8. Limitación de responsabilidad</h2>
      <p className="text-ink/90 leading-relaxed">
        En la máxima medida permitida por la ley aplicable, DR TV no será
        responsable por daños indirectos, incidentales o consecuentes
        derivados del uso o imposibilidad de uso del sitio, del contenido
        transmitido por las cadenas enlazadas, o de cualquier interacción
        con servicios de terceros a los que enlacemos.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">9. Cambios a estos términos</h2>
      <p className="text-ink/90 leading-relaxed">
        Podemos actualizar estos términos ocasionalmente. Cuando lo hagamos,
        cambiaremos la fecha de "última actualización" en la parte superior.
        El uso continuado del sitio después de la publicación de los cambios
        constituye tu aceptación de la versión actualizada.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">10. Jurisdicción</h2>
      <p className="text-ink/90 leading-relaxed">
        Estos términos se rigen por la legislación aplicable en el domicilio
        del proyecto. Cualquier disputa se procurará resolver primero de
        buena fe mediante comunicación directa desde la página de{" "}
        <Link href="/contacto">Contacto</Link>.
      </p>
    </article>
  );
}
