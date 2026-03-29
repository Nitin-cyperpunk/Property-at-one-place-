import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * While auth UI is disabled, set BYPASS_AUTH_OWNER_ID (and NEXT_PUBLIC_* for uploads)
 * to a real auth.users id from the Supabase dashboard so owner flows still work.
 */
export function getBypassOwnerId(): string | null {
  const id = process.env.BYPASS_AUTH_OWNER_ID?.trim();
  return id && /^[0-9a-f-]{36}$/i.test(id) ? id : null;
}

export async function resolveOwnerId(supabase: SupabaseClient): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.id) return user.id;
  return getBypassOwnerId();
}
