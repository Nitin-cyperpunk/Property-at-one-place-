// import { Suspense } from "react";
// import { redirect } from "next/navigation";

// import { LoginForm } from "@/components/LoginForm";
// import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Login · RentSetGo",
};

// type PageProps = {
//   searchParams: Promise<{ next?: string; error?: string }>;
// };

export default function LoginPage() {
  // const supabase = await createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // const sp = await searchParams;
  // if (user) {
  //   const dest = sp.next?.startsWith("/") ? sp.next : "/owner/dashboard";
  //   redirect(dest);
  // }
  // const authError = sp.error === "auth";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Login</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Sign-in is turned off while we build features. Use <strong>Owner</strong> in the nav to try owner
          flows. Uncomment auth in the codebase when you are ready to ship login.
        </p>
      </div>

      {/* <Suspense fallback={<p className="text-center text-sm text-zinc-500">Loading…</p>}>
        <LoginForm />
      </Suspense> */}
    </main>
  );
}
