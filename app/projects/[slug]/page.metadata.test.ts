import { describe, expect, it } from "vitest";

import { projects } from "@/data/portfolio";
import { SOCIAL_IMAGE } from "@/lib/site";

import { generateMetadata } from "./page";

const slug = projects.find((p) => p.caseStudy)!.slug;

const metadataFor = (s: string) =>
  generateMetadata({ params: Promise.resolve({ slug: s }) });

describe("case-study generateMetadata", () => {
  // A page-level `openGraph` REPLACES the resolved one rather than merging into
  // it (next/dist/lib/metadata/resolve-metadata.js, `mergeMetadata`), and the
  // file-convention image from app/opengraph-image.tsx is only injected at the
  // segment owning that file. So whatever this block omits is simply absent from
  // the rendered page — which is how case studies shipped with no og:image.
  it("carries the social card image", async () => {
    const meta = await metadataFor(slug);

    expect(meta.openGraph?.images).toContainEqual(
      expect.objectContaining({ url: SOCIAL_IMAGE.url }),
    );
  });

  it("carries siteName and locale", async () => {
    const meta = await metadataFor(slug);

    expect(meta.openGraph).toMatchObject({
      siteName: "Arkadiusz Ostrowski",
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
