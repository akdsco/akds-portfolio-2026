import { describe, expect, it } from "vitest";

import { metadata } from "./page";

describe("about page metadata", () => {
  it("titles the tab after the route", () => {
    expect(metadata.title).toBe("about");
  });

  // Asserting an ABSENCE on purpose — do not "fix" this by adding an openGraph
  // block to set og:title.
  //
  // A page-level openGraph REPLACES the layout's rather than merging into it, so
  // declaring one here drops the root opengraph-image this page inherits and
  // /about ships with no card at all. The layout pins og:title on this page's
  // behalf instead. Both facts are invisible in the metadata object — only the
  // rendered <head> shows it — which is how this shipped broken once already.
  it("declares no openGraph, so the root card survives", () => {
    expect(metadata).not.toHaveProperty("openGraph");
  });

  it("is the canonical landing page", () => {
    expect(metadata.alternates).toMatchObject({ canonical: "/about" });
  });
});
