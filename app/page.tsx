import type { Metadata } from "next";

import { PropertyCard } from "@/components/PropertyCard";
import { FilterBar } from "@/components/FilterBar";
import { listActiveProperties } from "@/lib/queries/properties";

export const metadata: Metadata = {
  title: "Flats for Rent in Nashik",
  description:
    "Browse latest rental properties in Nashik including 1BHK, 2BHK flats in Indra Nagar, Canada Corner and more.",
};

/** Search params + fresh Supabase reads on every request. */
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; max?: string; loc?: string }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = sp.q?.trim();
  const loc = sp.loc?.trim();
  const maxRaw = sp.max?.trim();
  const maxPrice = maxRaw ? Number(maxRaw) : undefined;

  const { rows: properties, error: listError } = await listActiveProperties({
    q: q || undefined,
    maxPrice: maxPrice !== undefined && Number.isFinite(maxPrice) ? maxPrice : undefined,
    location: loc || undefined,
  });

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-zinc-200 bg-zinc-50/80 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Find a place worth staying in
          </h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-600">
            Listings from individual owners. Filter by budget and area, then reach out directly.
          </p>
          <div className="mt-8">
            <FilterBar defaultQ={q} defaultMax={maxRaw} defaultLocation={loc} />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        {listError && (
          <div
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-950"
            role="alert"
          >
            <p className="font-medium">Could not load listings from Supabase.</p>
            <p className="mt-2">{listError}</p>
            <p className="mt-2 text-red-900/90">
              Add <code className="rounded bg-red-100/80 px-1">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
              <code className="rounded bg-red-100/80 px-1">.env.local</code> (same key as for saving listings), or add{" "}
              <code className="rounded bg-red-100/80 px-1">SELECT</code> policies on{" "}
              <code className="rounded bg-red-100/80 px-1">properties</code> and{" "}
              <code className="rounded bg-red-100/80 px-1">property_images</code>.
            </p>
          </div>
        )}

        {properties.length === 0 && !listError ? (
          <div className="space-y-3 text-sm text-zinc-600">
            <p>No active listings match your filters.</p>
            <ul className="list-inside list-disc space-y-1 text-zinc-500">
              <li>Browse only shows rows where <code className="rounded bg-zinc-100 px-1">expires_at</code> is in the future.</li>
              <li>Clear filters with <span className="font-medium text-zinc-700">Reset</span> or widen search.</li>
              <li>Commas in the search box are treated as spaces so filters stay valid.</li>
            </ul>
          </div>
        ) : properties.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <li key={p.id}>
                <PropertyCard property={p} />
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
