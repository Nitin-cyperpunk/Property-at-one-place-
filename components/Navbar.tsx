import Link from "next/link";

// import { signOut } from "@/app/actions/auth";
// import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  // Auth UI disabled — restore createClient + user checks when implementing login/logout
  // const supabase = await createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

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
          <Link href="/owner/dashboard" className="hover:text-zinc-900">
            Owner
          </Link>
          <Link href="/owner/my-properties" className="hover:text-zinc-900">
            My properties
          </Link>
          {/* {user ? (
            <>
              <Link href="/owner/dashboard" className="hover:text-zinc-900">
                Owner
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-zinc-500 hover:text-zinc-900"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-800"
            >
              Login
            </Link>
          )} */}
        </nav>
      </div>
    </header>
  );
}
