import { describe, expect, test } from "vitest";

import { projects, testimonials } from "@/data/portfolio";

// Invariants tsc can't catch: typo'd slugs, dangling testimonial ids, and the
// featured/caseStudy intent that drives which projects get a detail page. These
// guard the data layer, which is hand-authored TS with no schema at runtime.
describe("portfolio data invariants", () => {
  test("project slugs are unique", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("every caseStudy.testimonialId resolves to a real testimonial", () => {
    const ids = new Set(testimonials.map((t) => t.id));
    for (const p of projects) {
      const ref = p.caseStudy?.testimonialId;
      if (ref === undefined) continue;
      expect(
        ids,
        `project "${p.slug}" references testimonial ${ref}`,
      ).toContain(ref);
    }
  });

  test("testimonial ids are unique", () => {
    const ids = testimonials.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // Current intent: the four featured projects are exactly the ones with a case
  // study (and thus a detail page). Earlier-work projects are card-only. If this
  // intent changes, update the assertions deliberately — don't just bump the
  // number.
  test("featured projects are exactly the ones with a case study", () => {
    const featured = projects.filter((p) => p.featured);
    const withCaseStudy = projects.filter((p) => p.caseStudy);

    expect(featured).toHaveLength(4);
    expect(featured.every((p) => p.caseStudy)).toBe(true);
    // No card-only project sneaks in a case study, and vice versa.
    expect(withCaseStudy.map((p) => p.slug).sort()).toEqual(
      featured.map((p) => p.slug).sort(),
    );
  });

  // Mirrors generateStaticParams in app/projects/[slug]/page.tsx: eligible pages
  // are exactly the projects with a caseStudy, keyed by unique slug.
  test("static-params-eligible projects are those with a case study", () => {
    const eligible = projects.filter((p) => p.caseStudy).map((p) => p.slug);
    expect(eligible.length).toBeGreaterThan(0);
    expect(new Set(eligible).size).toBe(eligible.length);
  });
});
