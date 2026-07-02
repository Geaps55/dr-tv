import { loginAction } from "../actions";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata = { title: "Admin — Iniciar sesión", robots: { index: false } };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  if (isAdminAuthenticated()) redirect("/admin");

  async function submit(formData: FormData) {
    "use server";
    const result = await loginAction(formData);
    if (result?.error) {
      redirect(`/admin/login?error=${encodeURIComponent(result.error)}`);
    }
  }

  return (
    <div className="max-w-sm mx-auto py-16">
      <h1 className="font-display text-3xl text-ink mb-6">Admin</h1>
      <form action={submit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink mb-1">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-ink"
          />
        </div>
        {searchParams.error ? (
          <p className="text-sm text-live">{searchParams.error}</p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-full bg-cobalt text-white px-4 py-2 font-semibold"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
