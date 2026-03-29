"use client";

/*
 * AUTH DISABLED — restore this component when implementing login / signup.
 *
 * import { useSearchParams } from "next/navigation";
 * import { useState } from "react";
 * import { createClient } from "@/lib/supabase/client";
 *
 * export function LoginForm() {
 *   const searchParams = useSearchParams();
 *   const nextPath = searchParams.get("next") || "/owner/dashboard";
 *   const [email, setEmail] = useState("");
 *   ...
 *   await supabase.auth.signInWithOtp({ email: trimmed, options: { emailRedirectTo: redirectUrl } });
 *   ...
 * }
 */

/** Placeholder so imports do not break if you re-enable the login page. */
export function LoginForm() {
  return (
    <p className="text-center text-sm text-zinc-500">
      Login form is commented out. See <code className="rounded bg-zinc-100 px-1">LoginForm.tsx</code>.
    </p>
  );
}
