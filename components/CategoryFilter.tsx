"use client";

import { useState } from "react";
import { CATEGORIES, type Category } from "@/lib/types";
import { ChannelCard } from "./ChannelCard";
import { AdsSuppressor } from "./AdsSuppressor";
import type { Channel } from "@/lib/types";

type Filter = "all" | Category;

const OPTIONS: { key: Filter; label: string }[] = [
  { key: "all", label: "Todos" },
  ...CATEGORIES.map((c) => ({ key: c.key as Filter, label: c.label })),
];

export function FilterableGrid({
  channels,
  initialQuery = "",
}: {
  channels: Channel[];
  initialQuery?: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState(initialQuery);
  const q = query.trim().toLowerCase();
  const visible = channels.filter((c) => {
    if (filter !== "all" && c.category !== filter) return false;
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      (c.province ?? "").toLowerCase().includes(q)
    );
  });
  return (
    <div>
      {q ? (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-black/10 bg-white px-4 py-2 text-sm">
          <span className="text-muted">
            Resultados para <strong className="text-ink">"{query}"</strong>{" "}
            <span className="text-muted">({visible.length})</span>
          </span>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-cobalt hover:underline"
          >
            Limpiar
          </button>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Filtrar por categoría">
        {OPTIONS.map((opt) => {
          const active = filter === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(opt.key)}
              className={
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
                (active
                  ? "bg-cobalt text-white"
                  : "bg-white text-muted hover:text-ink border border-black/5")
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {visible.map((c) => (
          <ChannelCard key={c.id} channel={c} />
        ))}
      </div>
      {visible.length === 0 && (
        <>
          <AdsSuppressor />
          <p className="text-center text-muted py-12">
            {q
              ? `No encontramos canales que coincidan con "${query}".`
              : "No hay canales disponibles en esta categoría."}
          </p>
        </>
      )}
    </div>
  );
}
