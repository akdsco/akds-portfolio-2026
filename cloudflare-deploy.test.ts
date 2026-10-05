import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

// Deploy-artifact invariants for the Cloudflare Pages static export. The test
// lives at the repo root rather than beside the file it checks, because Next
// copies ALL of public/ verbatim into out/ — a *.test.ts in public/ would ship
// to production.
describe("cloudflare _redirects", () => {
  const source = readFileSync(join(__dirname, "public/_redirects"), "utf8");

  // Under `output: export` app/page.tsx's redirect() emits a client-JS-only
  // redirect (an empty index.html carrying a NEXT_REDIRECT payload) — no HTTP
  // status, nothing for a crawler or no-JS client. Cloudflare's rule fires
  // server-side before any asset is served ("Redirects are always followed,
  // regardless of whether or not an asset matches"), so it shadows that broken
  // page with a real 301. This rule is load-bearing, not decorative.
  it("301-redirects the root path to /about", () => {
    const hasRule = source
      .split("\n")
      .some((line) => /^\s*\/\s+\/about\s+301\s*$/.test(line));
    expect(hasRule).toBe(true);
  });
});
