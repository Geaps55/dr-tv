"use client";

import { useState } from "react";
import { CATEGORIES, type Category } from "@/lib/types";
import { ChannelCard } from "./ChannelCard";
import type { Channel } from "@/lib/types";

type Filter = "all" | Category;

const OPTIONS: { key: Filter; label: string }[] = [
  { key: "all", label: "Todos" },
  ...CATEGORIES.map((c) => ({ key: c.key as Filter, label: c.label })),
];

export function FilterableGrid({ channels }: { channels: Channel[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible =
    filter === "all" ? channels : channels.filter((c) => c.category === filter);
  return (
    <div>
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
        <p className="text-center text-muted py-12">No hay canales disponibles en esta categoría.</p>
      )}
    </div>
  );
}
