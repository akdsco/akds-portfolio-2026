import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

// Emitted as a static robots.txt at build time — `output: export` has no server.
export const dynamic = "force-static";

// A public portfolio: allow everything, and hand crawlers the sitemap so the
// case-study detail pages get discovered.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
