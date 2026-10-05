import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

// With `output: 'export'` there is no server to render metadata/OG routes on
// request, so every such route must opt into build-time generation with
// `export const dynamic = "force-static"`. Next aborts the export build on any
// route that omits it. The export build in CI is the real guard; this test is a
// fast local signal that names the exact file when one regresses, and documents
// why the directive is mandatory. `dynamic` cannot be re-exported (Next must
// parse it in the source file), so a presence check is the honest unit here.
const ROUTES_REQUIRING_FORCE_STATIC = [
  "opengraph-image.tsx",
  "twitter-image.tsx",
  "about/opengraph-image.tsx",
  "about/twitter-image.tsx",
  "projects/opengraph-image.tsx",
  "projects/twitter-image.tsx",
  "projects/[slug]/opengraph-image.tsx",
  "projects/[slug]/twitter-image.tsx",
  "robots.ts",
  "sitemap.ts",
] as const;

describe("static-export route config", () => {
  it.each(ROUTES_REQUIRING_FORCE_STATIC)(
    "%s declares export const dynamic = force-static",
    (route) => {
      const source = readFileSync(join(__dirname, route), "utf8");
      expect(source).toMatch(
        /export\s+const\s+dynamic\s*=\s*["']force-static["']/,
      );
    },
  );
});
