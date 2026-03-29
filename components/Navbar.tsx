import Link from "next/link";

import { signOut } from "@/app/actions/auth";
import { getProfileForUser, isOwnerRole } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await getProfileForUser(supabase, user.id) : null;
  const showOwnerNav = user && isOwnerRole(profile?.role);

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-[15px] font-semibold tracking-tight text-zinc-900">
          RentSetGo
        </Link>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-600">
          <Link href="/" className="hover:text-zinc-900">
            Browse
          </Link>
          {showOwnerNav && (
            <>
              <Link href="/owner/dashboard" className="hover:text-zinc-900">
                Owner dashboard
              </Link>
              <Link href="/owner/my-properties" className="hover:text-zinc-900">
                My properties
              </Link>
            </>
          )}
          {user ? (
            <form action={signOut}>
              <button type="submit" className="text-zinc-500 hover:text-zinc-900">
                Log out
              </button>
            </form>
          ) : (
            <>
              <Link href="/login" className="hover:text-zinc-900">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-800"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
