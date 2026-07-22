import { describe, expect, test } from "vitest";

import { truncateForMeta } from "@/lib/truncate";

describe("truncateForMeta", () => {
  test("returns text within the cap unchanged", () => {
    expect(truncateForMeta("short and sweet", 155)).toBe("short and sweet");
    // exactly at the cap is still untouched
    const exact = "x".repeat(20);
    expect(truncateForMeta(exact, 20)).toBe(exact);
  });

  test("caps over-long text to max, ending in a single ellipsis", () => {
    const long = "word ".repeat(60).trim(); // 299 chars
    const out = truncateForMeta(long, 155);
    expect(out.length).toBeLessThanOrEqual(155);
    expect(out.endsWith("…")).toBe(true);
    expect(out.endsWith("……")).toBe(false);
  });

  test("cuts at a word boundary, never mid-word", () => {
    expect(truncateForMeta("alpha beta gamma delta", 12)).toBe("alpha beta…");
  });

  test("strips trailing punctuation before the ellipsis", () => {
    expect(truncateForMeta("one, two, three, four", 8)).toBe("one…");
  });
});
