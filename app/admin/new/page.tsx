import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { ChannelForm } from "@/components/ChannelForm";
import { createChannelAction } from "../actions";

export const metadata = { title: "Admin — Nuevo canal", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function NewChannelPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  requireAdmin();

  async function submit(formData: FormData) {
    "use server";
    const result = await createChannelAction(formData);
    if (result?.error) {
      redirect(`/admin/new?error=${encodeURIComponent(result.error)}`);
    }
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-muted no-underline">← Volver</Link>
      <h1 className="font-display text-3xl text-ink mt-2 mb-6">Nuevo canal</h1>
      <ChannelForm
        action={submit}
        submitLabel="Crear canal"
        errorMessage={searchParams.error}
      />
    </div>
  );
}
