import { createClient } from "@/lib/supabase/server";

/**
 * Server reads for `properties` / `property_images` using the session/anon client
 * so RLS policies apply (public SELECT on listings).
 */
export async function getSupabaseForReads() {
  return createClient();
}
