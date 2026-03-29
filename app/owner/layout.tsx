// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

// import { createClient } from "@/lib/supabase/server";

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  // Auth gate disabled — restore before production:
  // const supabase = await createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // if (!user) {
  //   const h = await headers();
  //   const next = h.get("x-login-next") ?? "/owner/dashboard";
  //   redirect(`/login?next=${encodeURIComponent(next)}`);
  // }

  return <>{children}</>;
}
