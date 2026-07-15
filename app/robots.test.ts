import { describe, expect, test } from "vitest";

import robots from "@/app/robots";
import { SITE_URL } from "@/lib/site";

describe("robots", () => {
  const result = robots();

  test("allows crawling the whole site", () => {
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    expect(rules).toContainEqual(
      expect.objectContaining({ userAgent: "*", allow: "/" }),
    );
  });

  test("points crawlers at the absolute sitemap URL", () => {
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
