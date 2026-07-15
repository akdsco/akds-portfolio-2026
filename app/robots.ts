import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

// A public portfolio: allow everything, and hand crawlers the sitemap so the
// case-study detail pages get discovered.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
