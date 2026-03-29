import type { SupabaseClient } from "@supabase/supabase-js";

/** Signed-in user's id (`auth.users`), or null when not authenticated. */
export async function resolveOwnerId(supabase: SupabaseClient): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}
