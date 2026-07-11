import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-muted">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="font-display font-semibold text-ink mb-2">DR TV</p>
            <p>Directorio de canales de televisión dominicanos en vivo.</p>
          </div>
          <nav aria-label="Enlaces del sitio" className="sm:text-right">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end">
              <li>
                <Link href="/sobre" className="hover:text-ink no-underline">
                  Sobre DR TV
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-ink no-underline">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-ink no-underline">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-ink no-underline">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="hover:text-ink no-underline">
                  DMCA
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="pt-4 border-t border-black/5">
          © {new Date().getFullYear()} DR TV. Los streams enlazados son propiedad de sus respectivas cadenas.
        </p>
      </div>
    </footer>
  );
}
