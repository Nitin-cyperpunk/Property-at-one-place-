import { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Used for post-login redirect; not needed while login is disabled.
  // const headers = new Headers(request.headers);
  // const path = request.nextUrl.pathname + request.nextUrl.search;
  // headers.set("x-login-next", path);
  // return updateSession(new NextRequest(request.url, { headers }));

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
