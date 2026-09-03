import { describe, expect, test } from "vitest";

import { hero } from "@/data/portfolio";
import { HIGHLIGHT, splitLede } from "@/lib/hero-lede";

// The hero lede renders one substring in the coral accent. If that substring
// isn't in the tagline, the accent vanishes and the word gets appended — a
// silent visual bug. These lock the split to the shipped copy.
describe("hero lede split", () => {
  test("recomposes the full tagline from before + highlight + after", () => {
    const { before, highlight, after } = splitLede(hero.tagline);
    expect(before + highlight + after).toBe(hero.tagline);
  });

  test("the highlighted phrase is present in the shipped tagline", () => {
    expect(hero.tagline).toContain(HIGHLIGHT);
  });

  test("throws loudly when the highlight is absent, never silently no-accents", () => {
    expect(() => splitLede("no accent here", "missing")).toThrow(/not found/i);
  });
});
