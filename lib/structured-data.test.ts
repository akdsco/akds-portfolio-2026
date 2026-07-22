import { describe, expect, test } from "vitest";

import { profile } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";
import { breadcrumbLd, profilePageLd, webSiteLd } from "@/lib/structured-data";

// Every URL Google reads from structured data must be absolute; a relative one
// is silently dropped. Walk any builder's output and collect string values that
// look like a URL field but aren't absolute.
function relativeUrls(node: unknown, key = ""): string[] {
  if (typeof node === "string") {
    const isUrlField = key === "url" || key === "item" || key === "image";
    return isUrlField && !/^https?:\/\//.test(node) ? [`${key}: ${node}`] : [];
  }
  if (Array.isArray(node)) return node.flatMap((v) => relativeUrls(v, key));
  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([k, v]) => relativeUrls(v, k));
  }
  return [];
}

describe("webSiteLd", () => {
  const ld = webSiteLd();

  test("is a schema.org WebSite rooted at the site origin", () => {
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("WebSite");
    expect(ld.url).toBe(SITE_URL);
    expect(ld.name).toBe(profile.fullName);
  });
});

describe("profilePageLd", () => {
  const ld = profilePageLd();
  const person = ld.mainEntity;

  test("wraps a Person in a ProfilePage", () => {
    expect(ld["@type"]).toBe("ProfilePage");
    expect(person["@type"]).toBe("Person");
  });

  test("names the owner and points at the canonical origin", () => {
    expect(person.name).toBe(profile.fullName);
    expect(person.url).toBe(SITE_URL);
  });

  test("job title is the lead segment of the owner's stated title (not invented)", () => {
    const lead = profile.title.split("·")[0]?.trim();
    expect(person.jobTitle).toBe(lead);
    expect(person.jobTitle).toBeTruthy();
  });

  test("image is absolute", () => {
    expect(person.image.startsWith(SITE_URL)).toBe(true);
  });

  test("sameAs is exactly the owner's own profile links — nothing invented", () => {
    expect(person.sameAs).toEqual(profile.socials.map((s) => s.url));
    // The two the recruiter path relies on are present.
    expect(person.sameAs).toContain("https://github.com/akdsco");
    expect(person.sameAs).toContain("https://www.linkedin.com/in/akds/");
  });
});

describe("breadcrumbLd", () => {
  const ld = breadcrumbLd([
    { name: "Projects", path: "/projects" },
    { name: "SlateIQ", path: "/projects/slate-iq" },
  ]);

  test("is a BreadcrumbList with sequential positions from 1", () => {
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement.map((i) => i.position)).toEqual([1, 2]);
  });

  test("each crumb is a ListItem with an absolute item URL under the origin", () => {
    for (const li of ld.itemListElement) {
      expect(li["@type"]).toBe("ListItem");
      expect(li.item.startsWith(SITE_URL)).toBe(true);
    }
    expect(ld.itemListElement.at(-1)?.name).toBe("SlateIQ");
  });
});

describe("no relative URLs leak into any block", () => {
  test.each([
    ["webSiteLd", webSiteLd()],
    ["profilePageLd", profilePageLd()],
    ["breadcrumbLd", breadcrumbLd([{ name: "Projects", path: "/projects" }])],
  ])("%s", (_name, ld) => {
    expect(relativeUrls(ld)).toEqual([]);
  });
});
