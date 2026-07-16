import { describe, expect, it } from "vitest";

import { plainText } from "./inline-links";

describe("plainText", () => {
  // Wherever a link can't be rendered — inside another anchor, or in a meta tag
  // — the markup has to degrade to its label. Leaking "[SlateIQ](https://…)"
  // into og:description would be worse than having no link at all.
  it("reduces a link to its label", () => {
    expect(
      plainText("Built [SlateIQ](https://slateiq.com/): a predictor."),
    ).toBe("Built SlateIQ: a predictor.");
  });

  it("handles several links", () => {
    expect(
      plainText("[one](https://a.example) and [two](https://b.example)"),
    ).toBe("one and two");
  });

  it("leaves plain prose untouched", () => {
    expect(plainText("No markup here at all.")).toBe("No markup here at all.");
  });

  it("leaves non-https markup as written, matching the renderer", () => {
    expect(plainText("[x](javascript:alert(1))")).toBe(
      "[x](javascript:alert(1))",
    );
  });

  it("is stable when called repeatedly (no shared regex state)", () => {
    const input = "[one](https://a.example) and [two](https://b.example)";
    expect(plainText(input)).toBe(plainText(input));
  });
});
