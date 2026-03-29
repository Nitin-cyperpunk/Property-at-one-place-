import { redirect } from "next/navigation";

import { getProfileForUser, isOwnerRole } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=%2Fowner%2Fdashboard");
  }

  const profile = await getProfileForUser(supabase, user.id);
  if (!isOwnerRole(profile?.role)) {
    redirect("/");
  }

  return <>{children}</>;
}
