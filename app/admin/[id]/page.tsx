import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseService } from "@/lib/supabase";
import { ChannelForm } from "@/components/ChannelForm";
import { saveChannelAction } from "../actions";
import type { Channel } from "@/lib/types";

export const metadata = { title: "Admin — Editar canal", robots: { index: false } };
export const dynamic = "force-dynamic";

async function getChannelById(id: string): Promise<Channel | null> {
  const { data, error } = await supabaseService()
    .from("channels")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as Channel;
}

export default async function EditChannelPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string; saved?: string };
}) {
  requireAdmin();
  const channel = await getChannelById(params.id);
  if (!channel) notFound();

  async function submit(formData: FormData) {
    "use server";
    const result = await saveChannelAction(params.id, formData);
    if (result?.error) {
      redirect(`/admin/${params.id}?error=${encodeURIComponent(result.error)}`);
    }
    redirect(`/admin/${params.id}?saved=1`);
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-muted no-underline">← Volver</Link>
      <h1 className="font-display text-3xl text-ink mt-2 mb-6">Editar: {channel.name}</h1>
      {searchParams.saved ? (
        <p className="mb-4 text-sm text-emerald-700">Guardado.</p>
      ) : null}
      <ChannelForm
        channel={channel}
        action={submit}
        submitLabel="Guardar cambios"
        errorMessage={searchParams.error}
      />
    </div>
  );
}
