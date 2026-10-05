import { describe, expect, it } from "vitest";

import { SITE_URL } from "@/lib/site";

// The canonical origin. The site moved to akds.dev (Cloudflare); arkadiusz.tech
// is being retired. SITE_URL feeds metadataBase, canonicals, robots and the
// sitemap, so it must be the new domain with no trailing slash (callers append
// their own paths — a trailing slash would double it).
describe("SITE_URL", () => {
  it("is the akds.dev origin", () => {
    expect(SITE_URL).toBe("https://akds.dev");
  });

  it("has no trailing slash", () => {
    expect(SITE_URL.endsWith("/")).toBe(false);
  });
});
