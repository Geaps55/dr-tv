import Link from "next/link";
import type { Channel } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

// Rendered by both /admin/[id] (edit) and /admin/new (create). The `action`
// prop is a server action passed by the parent page.
export function ChannelForm({
  channel,
  action,
  submitLabel,
  errorMessage,
}: {
  channel?: Partial<Channel>;
  action: (formData: FormData) => void;
  submitLabel: string;
  errorMessage?: string;
}) {
  const c = channel ?? {};
  return (
    <form action={action} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <Field label="Nombre" name="name" defaultValue={c.name} required />
      <Field label="Slug (URL)" name="slug" defaultValue={c.slug} placeholder="Se genera del nombre si se deja vacío" />
      <Select label="Categoría" name="category" defaultValue={c.category ?? "entertainment"}>
        {CATEGORIES.map((cat) => (
          <option key={cat.key} value={cat.key}>{cat.label}</option>
        ))}
      </Select>
      <Field label="Provincia" name="province" defaultValue={c.province ?? ""} />

      <div className="md:col-span-2">
        <Textarea
          label="Descripción del canal (visible en la página)"
          name="channel_description"
          defaultValue={c.channel_description}
          rows={4}
        />
      </div>

      <Select label="Tipo de embed" name="embed_type" defaultValue={c.embed_type ?? "link_only"}>
        <option value="youtube">YouTube</option>
        <option value="hls">HLS (.m3u8)</option>
        <option value="facebook">Facebook</option>
        <option value="iframe">Iframe (URL directa)</option>
        <option value="link_only">Solo enlace</option>
      </Select>
      <Field
        label="Embed source"
        name="embed_source"
        defaultValue={c.embed_source}
        placeholder="URL o ID según el tipo"
      />

      <Field label="URL de respaldo (sitio oficial)" name="fallback_url" defaultValue={c.fallback_url ?? ""} />
      <Field label="URL del logo" name="logo_url" defaultValue={c.logo_url ?? ""} />

      <div className="md:col-span-2 border-t border-black/10 mt-4 pt-4">
        <h2 className="font-display text-lg text-ink mb-3">SEO</h2>
      </div>
      <div className="md:col-span-2">
        <Field label="SEO title" name="seo_title" defaultValue={c.seo_title} required />
      </div>
      <div className="md:col-span-2">
        <Textarea
          label="SEO description"
          name="seo_description"
          defaultValue={c.seo_description}
          rows={2}
        />
      </div>

      <Select label="Estado" name="status" defaultValue={c.status ?? "active"}>
        <option value="active">Activo</option>
        <option value="broken">Roto</option>
        <option value="needs_review">Necesita revisión</option>
      </Select>
      <label className="flex items-center gap-2 pt-6">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={c.featured ?? false}
          className="h-4 w-4"
        />
        <span className="text-sm">Destacado</span>
      </label>

      {errorMessage ? (
        <p className="md:col-span-2 text-sm text-live">{errorMessage}</p>
      ) : null}

      <div className="md:col-span-2 flex items-center gap-3 mt-4">
        <button
          type="submit"
          className="rounded-full bg-cobalt text-white px-5 py-2 font-semibold"
        >
          {submitLabel}
        </button>
        <Link href="/admin" className="text-muted no-underline">Cancelar</Link>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2"
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
  rows = 3,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2"
      />
    </label>
  );
}

function Select({
  label,
  name,
  defaultValue,
  children,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2"
      >
        {children}
      </select>
    </label>
  );
}
