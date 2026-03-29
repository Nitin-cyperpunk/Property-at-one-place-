import type { Database } from "@/types/database.types";
import { resolveListingImageUrl } from "@/lib/supabase/public-image-url";

export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type PropertyImageRow = Database["public"]["Tables"]["property_images"]["Row"];

/** Property row with nested images from Supabase select. */
export type PropertyWithImages = Property & {
  property_images: Pick<PropertyImageRow, "id" | "image_url">[] | null;
};

/** Stable gallery order (DB may not have `created_at` on property_images). */
export function sortPropertyImages(
  images: Pick<PropertyImageRow, "id" | "image_url">[] | null | undefined
) {
  if (!images?.length) return [];
  return [...images].sort((a, b) => a.id.localeCompare(b.id));
}

export function coverImageUrl(p: PropertyWithImages): string | null {
  const sorted = sortPropertyImages(p.property_images);
  return resolveListingImageUrl(sorted[0]?.image_url);
}

export function allImageUrls(p: PropertyWithImages): string[] {
  return sortPropertyImages(p.property_images)
    .map((i) => resolveListingImageUrl(i.image_url))
    .filter((u): u is string => u != null);
}
