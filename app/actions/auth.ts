"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getProfileForUser, isOwnerRole } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";

export async function signInWithPassword(
  formData: FormData
): Promise<{ error?: string } | void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Could not establish a session." };
  }

  const profile = await getProfileForUser(supabase, user.id);
  revalidatePath("/", "layout");

  const nextRaw = String(formData.get("next") ?? "").trim();
  const safeNext =
    nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : null;
  if (safeNext) {
    redirect(safeNext);
  }

  redirect(isOwnerRole(profile?.role) ? "/owner/dashboard" : "/");
}

export async function signUpWithPassword(
  formData: FormData
): Promise<{ error?: string } | void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email.split("@")[0],
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");

  if (data.session) {
    const profile = await getProfileForUser(supabase, data.user.id);
    const dest = isOwnerRole(profile?.role) ? "/owner/dashboard" : "/";
    redirect(dest);
  }

  redirect("/login?message=check-email");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
