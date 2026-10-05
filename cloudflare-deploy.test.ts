import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

// Deploy-artifact invariants for the Cloudflare Pages static export. The test
// lives at the repo root rather than beside the file it checks, because Next
// copies ALL of public/ verbatim into out/ — a *.test.ts in public/ would ship
// to production.
describe("cloudflare _headers", () => {
  const source = readFileSync(join(__dirname, "public/_headers"), "utf8");

  // Next writes metadata OG/Twitter images as EXTENSIONLESS files (out/
  // opengraph-image, not .png). Static hosts type by extension, and Cloudflare
  // does not document a default for extensionless files, so without an explicit
  // rule the bytes could ship as application/octet-stream and strict social
  // scrapers (Twitter/LinkedIn/Slack) would reject the card. These rules pin
  // image/png. The real check is a post-deploy `curl -I` against the live URL.
  const rules = source
    .split(/\n(?=\/)/) // split into blocks, each starting at a path line
    .map((block) => block.trim())
    .filter(Boolean);

  const setsPngFor = (path: string) =>
    rules.some(
      (block) =>
        block.split("\n")[0]?.trim() === path &&
        /content-type:\s*image\/png/i.test(block),
    );

  it.each([
    "/opengraph-image",
    "/twitter-image",
    "/about/opengraph-image",
    "/about/twitter-image",
    "/projects/opengraph-image",
    "/projects/twitter-image",
    "/projects/*/opengraph-image",
    "/projects/*/twitter-image",
  ])("sets Content-Type image/png for %s", (path) => {
    expect(setsPngFor(path)).toBe(true);
  });
});

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
