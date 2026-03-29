import Link from "next/link";

import { PropertyCardCarousel } from "@/components/PropertyCardCarousel";
import { allImageUrls, type PropertyWithImages } from "@/types/property";

function formatRentInr(amount: number) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount}`;
  }
}

type Props = {
  property: PropertyWithImages;
};

const CARD_IMAGE_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

export function PropertyCard({ property }: Props) {
  const imageUrls = allImageUrls(property);

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:border-zinc-300">
      <PropertyCardCarousel
        urls={imageUrls}
        propertyId={property.id}
        sizes={CARD_IMAGE_SIZES}
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="line-clamp-2 text-[15px] font-medium leading-snug text-zinc-900">
            <Link href={`/property/${property.id}`} className="hover:underline">
              {property.title}
            </Link>
          </h2>
          <p className="shrink-0 text-[15px] font-semibold tabular-nums text-zinc-900">
            {formatRentInr(property.price)}
            <span className="text-xs font-normal text-zinc-500">/mo</span>
          </p>
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-800/80">
          {property.property_type}
        </p>
        {property.location ? (
          <p className="line-clamp-1 text-sm text-zinc-500">
            {property.location}
          </p>
        ) : null}
        <Link
          href={`/property/${property.id}`}
          className="mt-auto inline-flex w-fit items-center text-sm font-medium text-zinc-900 underline-offset-4 hover:underline"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
