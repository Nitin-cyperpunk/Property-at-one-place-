import Link from "next/link";

import { PropertyForm } from "@/components/PropertyForm";

export const metadata = {
  title: "Add property · RentSetGo",
};

export default function AddPropertyPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/40 via-zinc-50 to-zinc-100">
      <main className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <Link
          href="/owner/dashboard"
          className="inline-flex items-center gap-1 text-sm font-medium text-emerald-800/80 hover:text-emerald-900"
        >
          <span aria-hidden>←</span> Dashboard
        </Link>

        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xl shadow-zinc-200/50">
          <div className="border-b border-zinc-100 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold tracking-tight">New listing</h1>
            <p className="mt-2 max-w-md text-sm text-emerald-50/95">
              Describe the place, set rent and expiry, and upload photos — everything saves to your Supabase
              project.
            </p>
          </div>
          <div className="p-6 sm:p-8">
            <PropertyForm />
          </div>
        </div>
      </main>
    </div>
  );
}
