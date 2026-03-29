import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/LoginForm";
import { getProfileForUser, isOwnerRole } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Login · RentSetGo",
};

type PageProps = {
  searchParams: Promise<{ message?: string; next?: string }>;
};

function safeNextPath(raw: string | undefined): string | undefined {
  const t = raw?.trim() ?? "";
  if (t.startsWith("/") && !t.startsWith("//")) return t;
  return undefined;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const profile = await getProfileForUser(supabase, user.id);
    redirect(isOwnerRole(profile?.role) ? "/owner/dashboard" : "/");
  }

  const sp = await searchParams;
  const nextAfterLogin = safeNextPath(sp.next);
  const message = sp.message === "check-email" ? "Check your email to confirm your account, then sign in." : null;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Log in</h1>
        <p className="mt-2 text-sm text-zinc-600">Use your email and password to continue.</p>
      </div>

      {message && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {message}
        </p>
      )}

      <LoginForm nextPath={nextAfterLogin} />

      <p className="mt-6 text-center text-sm text-zinc-600">
        No account?{" "}
        <Link href="/signup" className="font-medium text-emerald-700 hover:text-emerald-800">
          Sign up
        </Link>
      </p>
    </main>
  );
}
