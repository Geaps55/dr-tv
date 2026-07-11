import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Política DMCA — DR TV" },
  description:
    "Política de retirada de contenido bajo la Digital Millennium Copyright Act (DMCA). Cómo notificar una infracción, contranotificar y política de infractores reincidentes de DR TV.",
  alternates: { canonical: "/dmca" },
};

const CONTACT_EMAIL = "contacto@dominicanrepublictv.com";
const LAST_UPDATED = "11 de julio de 2026";

export default function DmcaPage() {
  return (
    <article className="prose prose-neutral max-w-3xl">
      <nav aria-label="Ruta de navegación" className="text-xs text-muted mb-4 not-prose">
        <Link href="/" className="no-underline hover:underline">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span>Política DMCA</span>
      </nav>

      <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight">
        Política DMCA
      </h1>
      <p className="text-sm text-muted mt-2">Última actualización: {LAST_UPDATED}</p>

      <p className="text-ink/90 leading-relaxed mt-6">
        DR TV respeta los derechos de propiedad intelectual y cumple con la
        Digital Millennium Copyright Act (DMCA) de los Estados Unidos, así
        como con la legislación equivalente aplicable en la República
        Dominicana y en otras jurisdicciones donde tengamos audiencia. En
        esta página explicamos cómo notificar una presunta infracción, cómo
        respondemos a esas notificaciones y qué puedes hacer si consideras
        que un enlace fue retirado por error.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">
        1. Qué aloja DR TV y qué no
      </h2>
      <p className="text-ink/90 leading-relaxed">
        DR TV es un directorio editorial de canales de televisión de la
        República Dominicana que emiten en directo por internet.{" "}
        <strong>
          No alojamos, no almacenamos, no retransmitimos ni redistribuimos
          contenido de video en nuestros servidores.
        </strong>{" "}
        Los reproductores integrados en el sitio cargan directamente las
        transmisiones publicadas por las propias cadenas o sus proveedores
        oficiales, exactamente como lo haría el enlace original. Nuestra
        contribución editorial se limita al listado, la organización por
        categorías, las descripciones informativas y la curaduría.
      </p>
      <p className="text-ink/90 leading-relaxed">
        Aun así, si eres titular de derechos y consideras que el
        enlace, la miniatura, la descripción o cualquier otro elemento
        publicado en DR TV infringe tus derechos, puedes solicitar su
        retirada siguiendo el procedimiento descrito a continuación.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">
        2. Cómo enviar una notificación DMCA
      </h2>
      <p className="text-ink/90 leading-relaxed">
        Envía tu notificación por correo electrónico al agente designado de
        DR TV. Para que sea considerada válida bajo el título 17 U.S.C. §
        512(c)(3), la notificación debe incluir toda la información siguiente:
      </p>
      <ul className="text-ink/90 leading-relaxed">
        <li>
          Una firma física o electrónica del titular de los derechos de autor
          o de la persona autorizada a actuar en su nombre.
        </li>
        <li>
          Identificación específica de la obra protegida presuntamente
          infringida (nombre del canal, programa, marca comercial o material
          concreto).
        </li>
        <li>
          Identificación del material que se alega que infringe los
          derechos y su ubicación exacta en DR TV: la URL completa de la
          página del canal (por ejemplo, https://dominicanrepublictv.com/canal/…),
          y el elemento específico dentro de esa página (reproductor,
          miniatura, descripción, título).
        </li>
        <li>
          Datos de contacto suficientes para que podamos comunicarnos
          contigo: nombre completo, dirección postal, número de teléfono y
          dirección de correo electrónico.
        </li>
        <li>
          Una declaración de que tienes buena fe al creer que el uso del
          material objetado no está autorizado por el titular de los
          derechos, su agente o la ley.
        </li>
        <li>
          Una declaración, bajo pena de perjurio, de que la información
          contenida en la notificación es exacta y de que estás autorizado a
          actuar en nombre del titular de un derecho exclusivo presuntamente
          infringido.
        </li>
      </ul>

      <h2 className="font-display text-2xl text-ink mt-10">
        3. Agente designado
      </h2>
      <div className="not-prose my-6 rounded-xl border border-black/10 bg-surface p-6">
        <p className="text-sm text-muted uppercase tracking-wider">
          Notificaciones DMCA
        </p>
        <p className="mt-2">
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Notificaci%C3%B3n%20DMCA`}
            className="font-display text-xl text-cobalt no-underline hover:underline break-all"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="mt-3 text-sm text-muted">
          Asunto sugerido: "Notificación DMCA — [nombre del canal o material]".
          Adjunta la notificación como texto en el cuerpo del mensaje o como
          PDF firmado.
        </p>
      </div>

      <h2 className="font-display text-2xl text-ink mt-10">
        4. Nuestro proceso de respuesta
      </h2>
      <p className="text-ink/90 leading-relaxed">
        Cuando recibimos una notificación DMCA completa y de buena fe:
      </p>
      <ul className="text-ink/90 leading-relaxed">
        <li>
          Acusamos recibo por correo electrónico, generalmente dentro de las
          72 horas hábiles siguientes.
        </li>
        <li>
          Revisamos la notificación y, si es válida, retiramos o
          deshabilitamos el acceso al enlace, miniatura o descripción
          objetados en un plazo razonable —habitualmente dentro de los 5
          días hábiles siguientes.
        </li>
        <li>
          Notificamos al equipo editorial interno para que el canal quede
          registrado en nuestra lista de material retirado y no sea
          reintroducido por error.
        </li>
        <li>
          Si la notificación es incompleta, insuficiente o presenta indicios
          de mala fe, te pediremos aclaraciones antes de actuar.
        </li>
      </ul>

      <h2 className="font-display text-2xl text-ink mt-10">
        5. Contranotificación
      </h2>
      <p className="text-ink/90 leading-relaxed">
        Si consideras que un enlace o material fue retirado por error o como
        resultado de una identificación equivocada, puedes enviarnos una
        contranotificación al mismo correo. Para ser válida, la
        contranotificación debe incluir:
      </p>
      <ul className="text-ink/90 leading-relaxed">
        <li>Tu firma física o electrónica.</li>
        <li>
          Identificación del material retirado y la ubicación en la que
          aparecía antes de la retirada.
        </li>
        <li>
          Una declaración, bajo pena de perjurio, de que tienes buena fe al
          creer que el material fue retirado como consecuencia de un error o
          identificación errónea.
        </li>
        <li>
          Tu nombre, dirección postal, número de teléfono y consentimiento a
          la jurisdicción del tribunal federal del distrito judicial en el
          que resides (o, si estás fuera de EE. UU., cualquier distrito
          judicial en el que DR TV opere), así como aceptación de ser
          notificado por el reclamante original o su agente.
        </li>
      </ul>
      <p className="text-ink/90 leading-relaxed">
        Reenviaremos la contranotificación al reclamante original. Si en un
        plazo de 10 a 14 días hábiles no recibimos aviso de que ha
        iniciado un procedimiento judicial para obtener una orden de
        restricción, podremos restablecer el material retirado.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">
        6. Política de infractores reincidentes
      </h2>
      <p className="text-ink/90 leading-relaxed">
        DR TV mantiene una política interna de terminación para
        colaboradores editoriales y contribuyentes que sean identificados
        como infractores reincidentes. Aunque el catálogo público de canales
        no admite contribuciones abiertas de usuarios, cualquier cuenta
        interna, editor o colaborador que reincida en la publicación de
        material infractor será suspendida y, en su caso, dada de baja de
        forma permanente.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">
        7. Notificaciones falsas o abusivas
      </h2>
      <p className="text-ink/90 leading-relaxed">
        La ley DMCA prevé responsabilidad por daños y perjuicios, incluidos
        los honorarios de abogados, contra cualquier persona que
        presente conscientemente una notificación falsa de infracción. Si no
        estás seguro de si tu situación cumple los requisitos de una
        notificación válida, te recomendamos consultar con un abogado
        antes de enviarla.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">
        8. Solicitudes fuera del alcance DMCA
      </h2>
      <p className="text-ink/90 leading-relaxed">
        Si representas a una cadena dominicana y simplemente deseas
        modificar la descripción, actualizar el enlace oficial de tu canal,
        pedir una corrección editorial o coordinar la publicación de una
        señal nueva, no necesitas presentar una notificación DMCA. Escríbenos
        directamente desde la página de{" "}
        <Link href="/contacto">Contacto</Link> y lo resolvemos por la vía
        editorial habitual, con prioridad para solicitudes provenientes de
        titulares de derechos verificables.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">
        9. Cambios a esta política
      </h2>
      <p className="text-ink/90 leading-relaxed">
        Podemos actualizar esta política DMCA cuando cambie la legislación
        aplicable, cuando ajustemos nuestros procesos internos o cuando lo
        requiera la operativa del sitio. La fecha de "última actualización"
        en la parte superior siempre reflejará la versión vigente.
      </p>

      <p className="text-ink/90 leading-relaxed mt-8">
        Para cualquier duda sobre esta política, escríbenos desde{" "}
        <Link href="/contacto">Contacto</Link>. Para asuntos generales de uso
        del sitio, consulta también nuestros{" "}
        <Link href="/terminos">Términos de Uso</Link> y nuestra{" "}
        <Link href="/privacidad">Política de Privacidad</Link>.
      </p>
    </article>
  );
}
