import "@testing-library/jest-dom/vitest";

import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount React trees between tests so DOM/state don't leak across cases.
afterEach(() => {
  cleanup();
});

// jsdom implements neither of these browser APIs, but several components call
// them (theme + reduced-motion checks, scroll-spy, collapsibles). Stub them so
// rendering doesn't throw. Keep them minimal — behaviour-specific overrides
// belong in the individual tests.

// matchMedia: return a non-matching, event-capable MediaQueryList.
vi.stubGlobal(
  "matchMedia",
  vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(), // deprecated, but some libs still call it
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
);

// IntersectionObserver / ResizeObserver: no-op classes.
class NoopObserver {
  observe() {
    /* no-op */
  }
  unobserve() {
    /* no-op */
  }
  disconnect() {
    /* no-op */
  }
  takeRecords() {
    return [];
  }
}
vi.stubGlobal("IntersectionObserver", NoopObserver);
vi.stubGlobal("ResizeObserver", NoopObserver);

// scrollIntoView isn't implemented in jsdom; AboutMore calls it on reveal.
Element.prototype.scrollIntoView = vi.fn();
