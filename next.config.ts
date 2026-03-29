import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Listing form uploads images via Server Actions; default body limit is 1 MB.
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "*.storage.supabase.co",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
