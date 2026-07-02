import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllChannels } from "@/lib/channels";
import { logoutAction } from "./actions";
import { CATEGORY_LABELS } from "@/lib/types";

export const metadata = { title: "Admin — Canales", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminHome() {
  requireAdmin();
  const channels = await getAllChannels();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-ink">Canales</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/new"
            className="rounded-full bg-cobalt text-white px-4 py-1.5 text-sm font-semibold no-underline"
          >
            + Nuevo canal
          </Link>
          <form action={logoutAction}>
            <button className="text-sm text-muted underline">Cerrar sesión</button>
          </form>
        </div>
      </div>

      <div className="overflow-x-auto rounded-card border border-black/5 bg-white">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-black/5 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Nombre</th>
              <th className="px-4 py-2 font-medium">Categoría</th>
              <th className="px-4 py-2 font-medium">Provincia</th>
              <th className="px-4 py-2 font-medium">Embed</th>
              <th className="px-4 py-2 font-medium">Estado</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {channels.map((c) => (
              <tr key={c.id} className="border-t border-black/5">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span>{c.name}</span>
                    {c.featured && (
                      <span className="text-[10px] rounded bg-cobalt/10 text-cobalt px-1.5 py-0.5">
                        Destacado
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-muted">{CATEGORY_LABELS[c.category]}</td>
                <td className="px-4 py-2 text-muted">{c.province ?? "—"}</td>
                <td className="px-4 py-2 text-muted">{c.embed_type}</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      c.status === "active"
                        ? "text-emerald-700"
                        : c.status === "broken"
                          ? "text-live"
                          : "text-amber-700"
                    }
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/${c.id}`}
                    className="text-cobalt no-underline"
                  >
                    Editar →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
