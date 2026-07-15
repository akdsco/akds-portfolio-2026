import type { MetadataRoute } from "next";

import { projects } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";

// Static routes worth indexing. `/` only redirects to `/about`, so `/about` is
// the canonical landing entry and `/` is deliberately omitted.
const staticRoutes = ["/about", "/projects"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudyRoutes = projects
    .filter((p) => p.caseStudy)
    .map((p) => `/projects/${p.slug}`);

  return [...staticRoutes, ...caseStudyRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
  }));
}
