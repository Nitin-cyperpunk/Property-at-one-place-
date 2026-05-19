import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { resolvePostAuthRedirect } from "@/lib/auth/post-auth";
import { safeNextPath } from "@/lib/auth/urls";
import { pathWithToast } from "@/lib/toast";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const code = url.searchParams.get("code");

    const oauthError =
      url.searchParams.get("error_description") ??
      url.searchParams.get("error");

    const nextRaw = url.searchParams.get("next") ?? "/";

    if (oauthError) {
      const login = new URL("/login", url.origin);
      login.searchParams.set("message", "auth-error");

      return NextResponse.redirect(login);
    }

    if (!code) {
      return NextResponse.redirect(
        new URL(safeNextPath(nextRaw) ?? "/", url.origin)
      );
    }

    const cookieStore = cookies();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase env variables");

      return NextResponse.redirect(new URL("/", url.origin));
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (err) {
            console.error("Cookie set error:", err);
          }
        },
      },
    });

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (exchangeError) {
      console.error("Exchange session error:", exchangeError);

      const login = new URL("/login", url.origin);

      login.searchParams.set("message", "auth-error");

      return NextResponse.redirect(login);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No user after session exchange");

      return NextResponse.redirect(
        new URL(safeNextPath(nextRaw) ?? "/", url.origin)
      );
    }

    const { path } = await resolvePostAuthRedirect(
      supabase,
      user.id,
      user,
      nextRaw
    );

    return NextResponse.redirect(new URL(pathWithToast(path, "welcome-back"), url.origin));
  } catch (err) {
    console.error("OAuth callback crash:", err);

    return NextResponse.redirect(
      new URL("/login?message=server-error", request.url)
    );
  }
}
