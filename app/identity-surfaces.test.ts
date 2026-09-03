import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "vitest";

// TB-131 (AC 2): the social card is a recruiter-facing identity surface, but its
// caption + alt live in modules that execute `next/og` at import time, so they
// can't be imported under jsdom. A source scan is the honest check — assert the
// old identity label is gone and the new one is present in the source text.
//
// Kept narrow on purpose: it targets the retired identity phrases, not the bare
// word "Engineer" (which legitimately survives as past-role job titles).
const read = (rel: string) =>
  readFileSync(join(process.cwd(), rel), { encoding: "utf8" });

describe("social-card identity surfaces", () => {
  test("the OG card caption reads AI Engineer, not Software Engineer", () => {
    const src = read("app/opengraph-image.tsx");
    expect(src).toContain("AI Engineer · London");
    expect(src).not.toMatch(/Software Engineer/);
  });

  test("the card alt text drops the old Software Engineer identity", () => {
    const src = read("lib/og-card.tsx");
    expect(src).not.toMatch(/Software Engineer/);
    expect(src).toMatch(/AI Engineer/);
  });
});
