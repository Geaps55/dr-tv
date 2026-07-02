"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  clearSessionCookie,
  isAdminAuthenticated,
  issueSession,
  setSessionCookie,
  verifyPassword,
} from "@/lib/admin-auth";
import { supabaseService, isSupabaseConfigured } from "@/lib/supabase";
import { slugify } from "@/lib/slug";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    return { error: "Contraseña incorrecta." };
  }
  setSessionCookie(issueSession());
  redirect("/admin");
}

export async function logoutAction() {
  clearSessionCookie();
  redirect("/admin/login");
}

export async function saveChannelAction(id: string, formData: FormData) {
  if (!isAdminAuthenticated()) redirect("/admin/login");
  if (!isSupabaseConfigured()) {
    return { error: "Supabase no está configurado. Añade las variables NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY." };
  }

  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
  const name = (raw.name ?? "").trim();
  if (!name) return { error: "El nombre es obligatorio." };

  const payload = {
    name,
    // Only recompute slug if user cleared it — never break existing URLs silently.
    slug: raw.slug?.trim() || slugify(name),
    category: raw.category,
    province: raw.province?.trim() || null,
    channel_description: raw.channel_description ?? "",
    embed_type: raw.embed_type,
    embed_source: raw.embed_source ?? "",
    fallback_url: raw.fallback_url?.trim() || null,
    logo_url: raw.logo_url?.trim() || null,
    seo_title: raw.seo_title ?? "",
    seo_description: raw.seo_description ?? "",
    status: raw.status,
    featured: raw.featured === "on",
  };

  const supabase = supabaseService();
  const { error } = await supabase.from("channels").update(payload).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath(`/canal/${payload.slug}`);
  revalidatePath(`/categoria/${payload.category}`);
  revalidatePath("/admin");
  return { success: true };
}

export async function createChannelAction(formData: FormData) {
  if (!isAdminAuthenticated()) redirect("/admin/login");
  if (!isSupabaseConfigured()) {
    return { error: "Supabase no está configurado." };
  }

  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
  const name = (raw.name ?? "").trim();
  if (!name) return { error: "El nombre es obligatorio." };

  const supabase = supabaseService();
  const { error } = await supabase.from("channels").insert({
    name,
    slug: raw.slug?.trim() || slugify(name),
    category: raw.category || "entertainment",
    province: raw.province?.trim() || null,
    channel_description: raw.channel_description ?? `${name}, canal dominicano en vivo.`,
    embed_type: raw.embed_type || "link_only",
    embed_source: raw.embed_source ?? "",
    fallback_url: raw.fallback_url?.trim() || null,
    seo_title: raw.seo_title || `${name} en Vivo | DR TV`,
    seo_description:
      raw.seo_description ||
      `Mira ${name} en vivo online gratis aquí en DR TV.`,
    status: raw.status || "active",
    featured: raw.featured === "on",
  });

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}
