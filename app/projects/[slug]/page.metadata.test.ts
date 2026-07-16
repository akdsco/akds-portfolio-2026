import { describe, expect, it } from "vitest";

import { projects } from "@/data/portfolio";
import { SITE_BRAND } from "@/lib/site";

import { generateMetadata } from "./page";

const slug = projects.find((p) => p.caseStudy)!.slug;

const metadataFor = (s: string) =>
  generateMetadata({ params: Promise.resolve({ slug: s }) });

describe("case-study generateMetadata", () => {
  // Asserting an ABSENCE on purpose — do not "fix" this by adding images.
  //
  // This segment owns an opengraph-image.tsx, so Next injects the per-project
  // card for us. It only does that while no level declares `images` itself
  // (next/dist/lib/metadata/resolve-metadata.js, ~line 149). Declaring it here
  // would silently swap every case study's card for the generic one — the tags
  // would still look right, so only a build + grep would catch it.
  it("declares no images, leaving the per-project card to the file convention", async () => {
    const meta = await metadataFor(slug);

    expect(meta.openGraph).not.toHaveProperty("images");
  });

  // Conversely, these two DO have to be repeated: a page-level openGraph
  // replaces the layout's rather than merging into it, so anything omitted here
  // is absent from the page. That's how case studies shipped with no og:image.
  it("carries siteName and locale", async () => {
    const meta = await metadataFor(slug);

    expect(meta.openGraph).toMatchObject({
      siteName: SITE_BRAND,
      locale: "en_GB",
    });
  });

  it("titles and describes the specific project", async () => {
    const project = projects.find((p) => p.slug === slug)!;
    const meta = await metadataFor(slug);

    expect(meta.openGraph?.title).toContain(project.title);
    expect(meta.openGraph?.description).toBe(project.hook);
  });

  it("returns empty metadata for a project with no case study", async () => {
    const plain = projects.find((p) => !p.caseStudy);
    if (!plain) return;

    expect(await metadataFor(plain.slug)).toEqual({});
  });
});
