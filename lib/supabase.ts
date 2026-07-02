import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Public/anon client — safe to use in server components and (if ever needed) the browser.
// RLS policies in schema.sql restrict this to SELECT on channels + site_settings.
let anonClient: SupabaseClient | null = null;
export function supabaseAnon(): SupabaseClient {
  if (anonClient) return anonClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.local.example to .env.local and fill them in.",
    );
  }
  anonClient = createClient(url, key, {
    auth: { persistSession: false },
  });
  return anonClient;
}

// Service-role client — server-only. Used by seed script + admin server actions.
// Bypasses RLS, so never import this from a "use client" file.
let serviceClient: SupabaseClient | null = null;
export function supabaseService(): SupabaseClient {
  if (serviceClient) return serviceClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Required for seeding and admin writes.",
    );
  }
  serviceClient = createClient(url, key, {
    auth: { persistSession: false },
  });
  return serviceClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
