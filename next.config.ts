import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` emits plain HTML/CSS/JS to `out/`, which
  // Cloudflare Pages serves directly. The site is 100% statically renderable
  // (every dynamic route has generateStaticParams; no API routes, Server
  // Actions, ISR or cookies), so no server runtime is needed.
  output: "export",

  // The default next/image loader runs on a server, which a static export has
  // none of. Serve the committed images as-is. Only hero.tsx uses next/image.
  images: { unoptimized: true },
};

export default nextConfig;
