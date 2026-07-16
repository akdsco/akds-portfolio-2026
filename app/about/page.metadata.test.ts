import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { metadata } from "./page";

describe("about page metadata", () => {
  it("titles the tab after the route", () => {
    expect(metadata.title).toBe("about");
  });

  // The card art is a giant "akds" wordmark, so the title beside it says the
  // page, not the brand again.
  it("titles the card after the page, with no brand prefix", () => {
    expect(metadata.openGraph).toMatchObject({ title: "about" });
  });

  // Declaring openGraph above is what makes this file mandatory: a page-level
  // openGraph REPLACES the layout's rather than merging into it, so /about stops
  // inheriting app/opengraph-image.tsx and ships with no card at all. Owning an
  // image at this segment is what puts it back. Deleting either one alone is
  // silent — the metadata object still looks right.
  it("owns a card, since declaring openGraph drops the inherited one", () => {
    // From the project root: the jsdom env gives import.meta.url an http:
    // scheme, so a file URL can't be resolved from here.
    const card = join(process.cwd(), "app/about/opengraph-image.tsx");
    expect(existsSync(card), `${card} must exist`).toBe(true);
    // And no `images` key, or that file convention is overridden in turn.
    expect(metadata.openGraph).not.toHaveProperty("images");
  });

  it("keeps the full name out of the tags", () => {
    expect(JSON.stringify(metadata)).not.toMatch(/Arkadiusz/);
  });

  it("is the canonical landing page", () => {
    expect(metadata.alternates).toMatchObject({ canonical: "/about" });
  });
});
