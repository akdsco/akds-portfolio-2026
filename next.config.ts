import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // lib/og-card.tsx reads the Geist .ttf files at runtime via a join(), which the
  // bundler can't see — without this they're missing from the deployment and the
  // social cards 500 in production while working perfectly in dev.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./lib/fonts/**"],
    "/twitter-image": ["./lib/fonts/**"],
    "/projects/[slug]/opengraph-image": ["./lib/fonts/**"],
    "/projects/[slug]/twitter-image": ["./lib/fonts/**"],
  },
};

export default nextConfig;
