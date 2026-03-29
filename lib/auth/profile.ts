import type { SupabaseClient } from "@supabase/supabase-js";

export type ProfileRole = "user" | "owner";

export type ProfileRow = {
  id: string;
  name: string | null;
  role: ProfileRole | string;
  created_at: string;
};

export async function getProfileForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<ProfileRow | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error || !data) return null;
  return data as ProfileRow;
}

export function isOwnerRole(role: string | null | undefined): boolean {
  return role === "owner";
}
