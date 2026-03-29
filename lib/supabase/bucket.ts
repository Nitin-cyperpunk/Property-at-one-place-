/** Shared bucket id — must match Supabase Storage (and `NEXT_PUBLIC_STORAGE_BUCKET` if set). */
export const DEFAULT_LISTING_BUCKET = "property-images";

export function getListingBucketId(): string {
  return process.env.NEXT_PUBLIC_STORAGE_BUCKET?.trim() || DEFAULT_LISTING_BUCKET;
}
