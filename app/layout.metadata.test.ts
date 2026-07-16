import { describe, expect, it, vi } from "vitest";

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
});
