import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CloudflareAnalytics } from "@/components/cloudflare-analytics";

const TOKEN_VAR = "NEXT_PUBLIC_CF_ANALYTICS_TOKEN";
const BEACON_SRC = "https://static.cloudflareinsights.com/beacon.min.js";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("CloudflareAnalytics", () => {
  it("renders nothing when the token is unset", () => {
    vi.stubEnv(TOKEN_VAR, "");
    const { container } = render(<CloudflareAnalytics />);
    expect(container.querySelector("script")).toBeNull();
  });

  it("renders the Cloudflare beacon carrying the token when set", () => {
    vi.stubEnv(TOKEN_VAR, "tok_abc123");
    const { container } = render(<CloudflareAnalytics />);

    const beacon = container.querySelector(`script[src="${BEACON_SRC}"]`);
    expect(beacon).not.toBeNull();
    expect(beacon).toHaveAttribute("defer");
    // The token rides in the data-cf-beacon JSON, which is what Cloudflare's
    // script reads to attribute the pageview to this site.
    const payload = beacon?.getAttribute("data-cf-beacon") ?? "";
    expect(JSON.parse(payload)).toEqual({ token: "tok_abc123" });
  });
});
