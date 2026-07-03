import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export function SiteHeader({ title }: { title: string }) {
  return (
    <header className="border-b border-black/5 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="no-underline">
            <span className="font-display font-bold text-2xl tracking-tight text-ink">
              DR<span className="text-cobalt"> TV</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {CATEGORIES.map((c) => (
              <Link
                key={c.key}
                href={`/categoria/${c.key}`}
                className="text-muted hover:text-ink no-underline"
              >
                {c.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <span className="sr-only">{title}</span>
    </header>
  );
}

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
