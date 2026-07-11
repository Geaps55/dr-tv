"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/types";

export function SiteHeader({ title }: { title: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchDefault, setSearchDefault] = useState("");
  const pathname = usePathname();

  // Close the mobile drawer on any route change.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Reflect ?q= in the input after navigation. Read from window rather than
  // useSearchParams() to avoid a Suspense boundary in the root layout.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search).get("q") ?? "";
    setSearchDefault(q);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-surface/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-3 md:gap-6 md:py-4">
          <Link href="/" className="no-underline shrink-0">
            <span className="font-display font-bold text-2xl tracking-tight text-ink">
              DR<span className="text-cobalt"> TV</span>
            </span>
          </Link>

          <nav
            aria-label="Categorías"
            className="hidden md:flex items-center gap-5 text-sm"
          >
            {CATEGORIES.map((c) => (
              <Link
                key={c.key}
                href={`/categoria/${c.key}`}
                className="text-muted hover:text-ink no-underline whitespace-nowrap"
              >
                {c.label}
              </Link>
            ))}
          </nav>

          <form
            method="get"
            action="/"
            role="search"
            className="flex-1 min-w-0 md:max-w-xs ml-auto"
          >
            <label htmlFor="site-search" className="sr-only">
              Buscar canal
            </label>
            <div className="relative">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                />
              </svg>
              <input
                id="site-search"
                key={searchDefault}
                type="search"
                name="q"
                defaultValue={searchDefault}
                inputMode="search"
                autoComplete="off"
                placeholder="Buscar canal…"
                className="w-full rounded-full border border-black/10 bg-white pl-9 pr-3 py-1.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-cobalt/40 focus:ring-2 focus:ring-cobalt/10"
              />
            </div>
          </form>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-ink hover:bg-black/5"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {menuOpen ? (
          <nav
            id="mobile-nav"
            aria-label="Categorías (móvil)"
            className="md:hidden flex flex-col py-2 border-t border-black/5"
          >
            {CATEGORIES.map((c) => (
              <Link
                key={c.key}
                href={`/categoria/${c.key}`}
                className="text-ink py-2.5 px-1 no-underline hover:bg-black/5 rounded"
              >
                {c.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
      <span className="sr-only">{title}</span>
    </header>
  );
}
