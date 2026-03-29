import { NextResponse } from "next/server";

// import { createClient } from "@/lib/supabase/server";

/**
 * Email magic links — disabled while auth is off. Re-enable GET handler below when you ship login.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  // const code = url.searchParams.get("code");
  // const nextRaw = url.searchParams.get("next") ?? "/owner/dashboard";
  // const next = nextRaw.startsWith("/") ? nextRaw : "/owner/dashboard";
  // if (code) {
  //   const supabase = await createClient();
  //   const { error } = await supabase.auth.exchangeCodeForSession(code);
  //   if (!error) {
  //     return NextResponse.redirect(new URL(next, url.origin));
  //   }
  // }
  // return NextResponse.redirect(new URL(`/login?error=auth&next=${encodeURIComponent(next)}`, url.origin));

  return NextResponse.redirect(new URL("/", url.origin));
}
