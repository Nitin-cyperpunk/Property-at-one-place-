import { getListingBucketId } from "@/lib/supabase/bucket";

/**
 * Turn a stored `property_images.image_url` into a browser-loadable URL.
 * Accepts full `getPublicUrl()` URLs, or a storage path like `ownerId/file.jpg`
 * (same shape as `storage.from(bucket).upload(path)`).
 */
export function resolveListingImageUrl(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;

  const bucket = getListingBucketId();
  let path = s.replace(/^\/+/, "");
  if (path.startsWith(`${bucket}/`)) {
    path = path.slice(bucket.length + 1);
  }
  const pathForUrl = path
    .split("/")
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg))
    .join("/");

  return `${base}/storage/v1/object/public/${bucket}/${pathForUrl}`;
}
