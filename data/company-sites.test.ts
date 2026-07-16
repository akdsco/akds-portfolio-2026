import { describe, expect, it } from "vitest";

import {
  companyHref,
  companySites,
  experience,
  projects,
  type CompanyName,
} from "@/data/portfolio";

describe("companySites", () => {
  // Record<CompanyName, CompanySite> makes this exhaustive at compile time —
  // adding a company without deciding its site won't typecheck. This asserts the
  // runtime shape matches, and that no entry is an empty string sneaked past.
  it("states a site or a reason for every company", () => {
    for (const [name, site] of Object.entries(companySites)) {
      expect(site, `${name} has no site decision`).toBeTruthy();
    }
  });

  it("covers every company used in experience and projects", () => {
    const used = new Set<string>([
      ...experience.map((r) => r.company),
      ...projects.map((p) => p.company),
    ]);

    for (const name of used) {
      expect(companySites, `${name} is missing`).toHaveProperty(name);
    }
  });

  it("only ever points at https", () => {
    for (const site of Object.values(companySites)) {
      if (site.startsWith("http")) expect(site).toMatch(/^https:\/\//);
    }
  });
});

describe("companyHref", () => {
  it("returns the url for a company that still has a site", () => {
    expect(companyHref("GrowthNation")).toBe("https://growthnation.ai");
    expect(companyHref("Noah Media Group")).toBe(
      "https://www.noahmediagroup.com/",
    );
  });

  // The sentinels are the point: absence is recorded as a decision, so it must
  // never leak to the DOM as an href like "url-no-longer-active".
  it("returns null for a company whose site is gone", () => {
    expect(companyHref("Connect4")).toBeNull();
    expect(companyHref("Wutzu Technologies")).toBeNull();
  });

  it("returns null for work that never had a public site", () => {
    expect(companyHref("Self-employed")).toBeNull();
  });

  it("never returns a non-url string", () => {
    const names = Object.keys(companySites) as CompanyName[];

    for (const name of names) {
      const href = companyHref(name);
      if (href !== null) expect(href).toMatch(/^https:\/\//);
    }
  });
});
