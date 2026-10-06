import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "advocaid-demo.s3.ap-southeast-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d2i0afz2m2bklk.cloudfront.net",
        pathname: "/**", // allow all paths
      },
      {
        protocol: "https",
        hostname: "ajxuatqnkjknuqeszdzz.storage.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ajxuatqnkjknuqeszdzz.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
