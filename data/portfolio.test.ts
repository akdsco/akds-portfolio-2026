import { describe, expect, test } from "vitest";

import { experience, projects, testimonials } from "@/data/portfolio";

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

  // The experience rail stacks end-over-start and reads as a timeline, so the
  // dates have to actually be one. A role that ends before it starts, or a list
  // out of order, would render as a plausible-looking lie.
  describe("experience timeline", () => {
    // "2025 Jul" / "2018" -> sortable. Bare years sit at the start of the year.
    const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
    const stamp = (s: string) => {
      const [year, month] = s.split(" ");
      const m = month ? MONTHS.indexOf(month) : 0;
      expect(Number(year), `year in "${s}"`).not.toBeNaN();
      expect(m, `month in "${s}"`).toBeGreaterThanOrEqual(0);
      return Number(year) * 12 + m;
    };

    test("no role ends before it starts", () => {
      for (const role of experience) {
        expect(
          stamp(role.end),
          `${role.company} (${role.start} – ${role.end})`,
        ).toBeGreaterThanOrEqual(stamp(role.start));
      }
    });

    test("roles are listed newest first", () => {
      const starts = experience.map((r) => stamp(r.start));
      expect(starts).toEqual([...starts].sort((a, b) => b - a));
    });
  });

  // A tag in both lists would render twice: once leading, once under "+n more".
  test("a role's lead and rest tags don't overlap", () => {
    for (const role of experience) {
      const dupes = role.stack.lead.filter((t) => role.stack.rest.includes(t));
      expect(dupes, `${role.company} lists these twice`).toEqual([]);
    }
  });
});
