import { describe, expect, it } from "vitest";

import { projects } from "@/data/portfolio";

import { generateMetadata } from "./page";

const caseStudySlug = projects.find((p) => p.caseStudy)!.slug;

describe("case-study metadata prose", () => {
  // A <meta> tag can't hold a link. If a hook ever carries inline-link markup,
  // it has to collapse to its label rather than ship "[x](https://…)" to
  // Google and every social scraper.
  it("never leaks inline-link markup into the description", async () => {
    for (const project of projects.filter((p) => p.caseStudy)) {
      const meta = await generateMetadata({
        params: Promise.resolve({ slug: project.slug }),
      });

      expect(meta.description).not.toMatch(/\]\(https/);
      expect(meta.openGraph?.description).not.toMatch(/\]\(https/);
    }
  });

  it("keeps og and meta descriptions in step", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: caseStudySlug }),
    });

    expect(meta.openGraph?.description).toBe(meta.description);
  });
});
