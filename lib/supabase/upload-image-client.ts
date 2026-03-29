import { createClient } from "@/lib/supabase/client";
import { getListingBucketId } from "@/lib/supabase/bucket";

/**
 * Client-side upload (browser). Requires Storage policies that allow the current user
 * (or anon, if you allow public uploads — not recommended).
 * Server actions use the service role instead — see `uploadImages` in `app/actions/properties.ts`.
 */
export async function uploadListingImageClient(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const fileName = `${Date.now()}-${safeName}`;

  const supabase = createClient();
  const bucket = getListingBucketId();

  const { error } = await supabase.storage.from(bucket).upload(fileName, file);

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}
