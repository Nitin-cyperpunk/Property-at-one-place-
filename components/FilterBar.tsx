import Link from "next/link";

type Props = {
  defaultQ?: string;
  defaultMax?: string;
  defaultLocation?: string;
};

/** GET / — keeps filters in the URL without client JS. */
export function FilterBar({ defaultQ = "", defaultMax = "", defaultLocation = "" }: Props) {
  return (
    <form
      method="get"
      action="/"
      className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <label className="flex min-w-[140px] flex-1 flex-col gap-1 text-sm">
        <span className="text-zinc-500">Search</span>
        <input
          name="q"
          type="search"
          placeholder="Title or area"
          defaultValue={defaultQ}
          className="rounded-md border border-zinc-200 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-400"
        />
      </label>
      <label className="flex w-full min-w-[120px] flex-col gap-1 text-sm sm:w-auto">
        <span className="text-zinc-500">Max rent (₹/mo)</span>
        <input
          name="max"
          type="number"
          min={0}
          step={1}
          placeholder="Any"
          defaultValue={defaultMax}
          className="rounded-md border border-zinc-200 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-400"
        />
      </label>
      <label className="flex min-w-[140px] flex-1 flex-col gap-1 text-sm">
        <span className="text-zinc-500">Location</span>
        <input
          name="loc"
          type="text"
          placeholder="Neighborhood, city…"
          defaultValue={defaultLocation}
          className="rounded-md border border-zinc-200 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-400"
        />
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Apply
        </button>
        <Link
          href="/"
          className="rounded-md border border-zinc-200 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
        >
          Reset
        </Link>
      </div>
    </form>
  );
}
