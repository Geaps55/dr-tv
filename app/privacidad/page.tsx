import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Política de Privacidad — DR TV" },
  description:
    "Cómo DR TV recoge y utiliza los datos de los usuarios, qué cookies se emplean, cómo funciona la publicidad de Google AdSense y cómo ejercer tus derechos.",
  alternates: { canonical: "/privacidad" },
};

const LAST_UPDATED = "3 de julio de 2026";

export default function PrivacidadPage() {
  return (
    <article className="prose prose-neutral max-w-3xl">
      <nav aria-label="Ruta de navegación" className="text-xs text-muted mb-4 not-prose">
        <Link href="/" className="no-underline hover:underline">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span>Política de Privacidad</span>
      </nav>

      <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight">
        Política de Privacidad
      </h1>
      <p className="text-sm text-muted mt-2">Última actualización: {LAST_UPDATED}</p>

      <p className="text-ink/90 leading-relaxed mt-6">
        En DR TV respetamos tu privacidad. Este documento explica de forma
        clara qué información se recoge cuando visitas el sitio, cómo se
        utiliza, con quién se comparte y qué opciones tienes para controlarla.
        Al usar dominicanrepublictv.com aceptas las prácticas descritas aquí.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">1. Quién es el responsable</h2>
      <p className="text-ink/90 leading-relaxed">
        DR TV es un directorio independiente de canales de televisión
        dominicanos operado por un pequeño equipo editorial. Si tienes
        preguntas sobre esta política o sobre tus datos, puedes contactarnos
        desde la página de <Link href="/contacto">Contacto</Link>.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">2. Qué datos recogemos directamente</h2>
      <p className="text-ink/90 leading-relaxed">
        DR TV no requiere registro, no ofrece cuentas de usuario y no recoge
        directamente datos personales como nombre, correo electrónico o
        número de teléfono para el uso normal del sitio. La única forma en
        que recibirás datos tuyos es si nos escribes voluntariamente desde el
        formulario de contacto, en cuyo caso solo procesaremos la información
        que decidas enviarnos para responderte.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">3. Cookies y tecnologías similares</h2>
      <p className="text-ink/90 leading-relaxed">
        Utilizamos las siguientes categorías de cookies:
      </p>
      <ul className="text-ink/90 leading-relaxed">
        <li>
          <strong>Cookies estrictamente necesarias:</strong> permiten que el
          reproductor funcione correctamente, guardan la última categoría que
          seleccionaste y mantienen la sesión de administración cuando aplica.
          No se pueden desactivar.
        </li>
        <li>
          <strong>Cookies de terceros (publicidad):</strong> Google AdSense
          coloca cookies para mostrar anuncios y medir su efectividad. Estas
          cookies pueden usarse para personalizar los anuncios que ves en
          función de tu actividad de navegación previa en sitios web de la
          red de Google.
        </li>
      </ul>
      <p className="text-ink/90 leading-relaxed">
        Puedes controlar y eliminar las cookies desde la configuración de tu
        navegador. Ten en cuenta que deshabilitar cookies puede afectar
        algunas funcionalidades del sitio.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">4. Publicidad y Google AdSense</h2>
      <p className="text-ink/90 leading-relaxed">
        DR TV muestra anuncios servidos por Google AdSense para cubrir los
        costos operativos del sitio. Google, como proveedor externo, utiliza
        cookies para publicar anuncios en función de tus visitas anteriores a
        DR TV y a otros sitios de la red publicitaria de Google.
      </p>
      <ul className="text-ink/90 leading-relaxed">
        <li>
          Google recopila datos como la dirección IP, el tipo de navegador,
          el sistema operativo, el idioma y las páginas visitadas, para
          decidir qué anuncios mostrar.
        </li>
        <li>
          Puedes inhabilitar el uso de cookies para publicidad personalizada
          visitando la{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Configuración de anuncios de Google
          </a>
          .
        </li>
        <li>
          También puedes optar por no participar en el uso de cookies de un
          proveedor externo visitando{" "}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
          >
            aboutads.info/choices
          </a>{" "}
          o{" "}
          <a
            href="https://www.youronlinechoices.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            youronlinechoices.com
          </a>
          .
        </li>
      </ul>
      <p className="text-ink/90 leading-relaxed">
        Para más información sobre cómo Google utiliza los datos cuando
        interactúas con sitios que usan sus servicios, consulta la{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
        >
          política de privacidad de socios de Google
        </a>
        .
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">5. Analítica</h2>
      <p className="text-ink/90 leading-relaxed">
        Podemos utilizar servicios de analítica web para entender cómo se usa
        el sitio de forma agregada —qué canales son más consultados, desde
        qué categorías llega el tráfico, en qué páginas hay problemas—.
        Estos datos se procesan sin identificar a usuarios individuales y
        nos sirven exclusivamente para mejorar el producto.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">6. Contenido de terceros</h2>
      <p className="text-ink/90 leading-relaxed">
        DR TV enlaza a transmisiones de video alojadas por las cadenas
        dominicanas y sus proveedores. Cuando reproduces un canal, tu
        navegador se conecta directamente a esos servidores de terceros y
        ellos pueden recoger datos técnicos según sus propias políticas de
        privacidad. No tenemos control sobre esos servicios y te
        recomendamos consultar la política de privacidad de cada cadena si
        deseas más detalles.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">7. Menores de edad</h2>
      <p className="text-ink/90 leading-relaxed">
        DR TV está dirigido a un público general adulto. No recogemos
        deliberadamente información personal de menores de 13 años. Si
        crees que un menor nos ha proporcionado información sin
        autorización, contáctanos y la eliminaremos.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">8. Tus derechos</h2>
      <p className="text-ink/90 leading-relaxed">
        Según tu jurisdicción (por ejemplo, si te encuentras en la Unión
        Europea bajo el RGPD, o en California bajo la CCPA), puedes tener
        derecho a acceder a los datos que se procesan sobre ti, corregirlos,
        eliminarlos, oponerte a ciertos usos o presentar una queja ante la
        autoridad correspondiente. Dado que no mantenemos cuentas de usuario
        ni bases de datos personales, la mayoría de estas solicitudes las
        deberás dirigir directamente a Google (para publicidad) o al
        proveedor de analítica. Si necesitas ayuda para localizar el canal
        adecuado, escríbenos.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">9. Cambios a esta política</h2>
      <p className="text-ink/90 leading-relaxed">
        Podemos actualizar esta política ocasionalmente para reflejar
        cambios legales, técnicos o de producto. Cuando lo hagamos,
        actualizaremos la fecha en la parte superior de esta página. Los
        cambios importantes se anunciarán de forma visible.
      </p>

      <h2 className="font-display text-2xl text-ink mt-10">10. Contacto</h2>
      <p className="text-ink/90 leading-relaxed">
        Si tienes preguntas sobre esta política, sobre cookies, o quieres
        ejercer algún derecho relacionado con tus datos, escríbenos desde la
        página de <Link href="/contacto">Contacto</Link>.
      </p>
    </article>
  );
}
