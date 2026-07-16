import { describe, expect, it, vi } from "vitest";

import { SITE_TITLE } from "@/lib/site";

// next/font/google is a build-time transform — the imported names are only real
// functions after Next rewrites them, so importing the layout under Vitest needs
// them stubbed. The stub returns the shape the layout consumes (a `variable`).
vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
}));

const { metadata } = await import("./layout");

describe("root layout metadata", () => {
  it("declares the large-image Twitter card", () => {
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  // Next auto-fills twitter title/description from the resolved openGraph, but
  // ONLY when twitter has no title of its own (postProcessMetadata in
  // next/dist/lib/metadata/resolve-metadata.js). Pinning them here disables that
  // for every descendant, so case-study pages inherit the generic site title
  // instead of the project's. Leave them unset; openGraph is the source.
  it("pins no twitter title or description, keeping per-page auto-fill alive", () => {
    expect(metadata.twitter).not.toHaveProperty("title");
    expect(metadata.twitter).not.toHaveProperty("description");
  });

  it("still names the site and locale on openGraph for children to inherit", () => {
    expect(metadata.openGraph).toMatchObject({
      siteName: "Arkadiusz Ostrowski",
      locale: "en_GB",
    });
  });

  // The tab reads as the route; a share card must not.
  it("titles tabs after the route", () => {
    expect(metadata.title).toMatchObject({ template: "akds : %s" });
  });

  // og:title falls back to the page's own `title`, and those are route segments
  // now — so an unpinned og:title ships "akds : about" to every feed that
  // scrapes the landing page. The floor is the site name; pages that can do
  // better say so themselves.
  it("pins og:title so the route-shaped tab title can't reach a share card", () => {
    expect(metadata.openGraph).toMatchObject({ title: SITE_TITLE });
    expect(SITE_TITLE).not.toMatch(/^akds : /);
  });

  // Description is the opposite case: unpinned, so each page's own blurb wins.
  it("pins no og:description, leaving each page's own to win", () => {
    expect(metadata.openGraph).not.toHaveProperty("description");
  });
});
