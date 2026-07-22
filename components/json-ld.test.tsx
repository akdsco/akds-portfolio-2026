import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { JsonLd } from "@/components/json-ld";

describe("JsonLd", () => {
  test("emits an application/ld+json script that parses back to the data", () => {
    const data = { "@context": "https://schema.org", "@type": "Thing" };
    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).not.toBeNull();
    const parsed = JSON.parse(script?.textContent ?? "null") as typeof data;
    expect(parsed).toEqual(data);
  });

  test("escapes `<` so a payload string cannot break out of the script tag", () => {
    const { container } = render(<JsonLd data={{ name: "</script><x>" }} />);
    const html = container.querySelector("script")!.innerHTML;
    // No raw closing tag survives...
    expect(html).not.toContain("</script>");
    expect(html).toContain("\\u003c");
    // ...but it's still valid JSON decoding back to the original string.
    const parsed = JSON.parse(html) as { name: string };
    expect(parsed.name).toBe("</script><x>");
  });
});
