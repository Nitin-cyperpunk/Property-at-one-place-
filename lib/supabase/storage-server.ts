import type { SupabaseClient } from "@supabase/supabase-js";

import { DEFAULT_LISTING_BUCKET, getListingBucketId } from "@/lib/supabase/bucket";
import { createServiceRoleClient } from "@/lib/supabase/service";

export { DEFAULT_LISTING_BUCKET, getListingBucketId };

/**
 * Prefer the service role for Storage on the server so uploads work even when
 * Storage RLS only allows service role, or when policies are not set up yet.
 * Falls back to the passed client (user session) if the key is missing.
 */
export function getStorageClientForUploads(sessionClient: SupabaseClient): SupabaseClient {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    return sessionClient;
  }
  try {
    return createServiceRoleClient();
  } catch {
    return sessionClient;
  }
}
