import { describe, expect, test } from "vitest";

import { commandList, filterCommands } from "@/components/command-palette";

// Locks the matcher against the looseness bug that shipped once: "/ttop" used to
// fuzzy-match "/testimonials". These assert against the real command list, so a
// future key/label change that reintroduces sloppy matches fails here.
const keysFor = (query: string) =>
  filterCommands(query, commandList).map((c) => c.key);

describe("filterCommands", () => {
  test("empty query returns every command", () => {
    expect(filterCommands("", commandList)).toHaveLength(commandList.length);
    expect(filterCommands("   ", commandList)).toHaveLength(commandList.length);
  });

  test("'/ttop' matches nothing (the regression guard)", () => {
    expect(keysFor("/ttop")).toEqual([]);
  });

  test("'/top' matches exactly /top", () => {
    expect(keysFor("/top")).toEqual(["/top"]);
  });

  test("'test' surfaces /testimonials", () => {
    expect(keysFor("test")).toContain("/testimonials");
  });

  test("'toggle' matches /theme by label", () => {
    // "/theme" has no "toggle" in its key — the match comes from its label
    // "Toggle light / dark".
    expect(keysFor("toggle")).toContain("/theme");
  });
});
