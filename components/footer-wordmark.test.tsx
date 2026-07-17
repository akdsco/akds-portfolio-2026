import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { FOOTER_SEEN_KEY, FooterWordmark } from "@/components/footer-wordmark";

// Capture the IntersectionObserver so a test can drive an intersection — jsdom's
// (and vitest.setup's) observer never fires on its own.
type MockEntry = {
  isIntersecting: boolean;
  target: Element;
};
const observers: MockObserver[] = [];
class MockObserver {
  cb: (entries: MockEntry[]) => void;
  elements: Element[] = [];
  disconnected = false;
  constructor(cb: (entries: MockEntry[]) => void) {
    this.cb = cb;
    observers.push(this);
  }
  observe(el: Element) {
    this.elements.push(el);
  }
  unobserve() {
    /* no-op */
  }
  disconnect() {
    this.disconnected = true;
  }
  enter() {
    this.cb(this.elements.map((target) => ({ isIntersecting: true, target })));
  }
}

function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? reduce : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

const mark = (ui: React.ReactElement) =>
  render(ui).container.firstChild as HTMLElement;

beforeEach(() => {
  observers.length = 0;
  sessionStorage.clear();
  stubReducedMotion(false);
  vi.stubGlobal("IntersectionObserver", MockObserver);
});

afterEach(() => {
  sessionStorage.clear();
});

describe("FooterWordmark", () => {
  test("renders the mark and waits, unassembled, for it to be seen", () => {
    const el = mark(<FooterWordmark />);
    expect(el).toHaveTextContent("akds");
    expect(el).not.toHaveAttribute("data-assemble");
    expect(observers).toHaveLength(1);
  });

  test("assembles once the mark scrolls into view, and remembers it", () => {
    const el = mark(<FooterWordmark />);
    act(() => {
      observers[0]?.enter();
    });

    expect(el).toHaveAttribute("data-assemble");
    expect(sessionStorage.getItem(FOOTER_SEEN_KEY)).toBeTruthy();
    // Stops watching — it's a one-shot, not a scroll-linked effect.
    expect(observers[0]?.disconnected).toBe(true);
  });

  test("stays quiet for the rest of the visit once it has played", () => {
    sessionStorage.setItem(FOOTER_SEEN_KEY, "1");
    const el = mark(<FooterWordmark />);

    // Doesn't even bother watching — the visit already had its moment.
    expect(observers).toHaveLength(0);
    expect(el).not.toHaveAttribute("data-assemble");
  });

  test("never assembles when reduced motion is asked for", () => {
    stubReducedMotion(true);
    const el = mark(<FooterWordmark />);

    expect(observers).toHaveLength(0);
    expect(el).not.toHaveAttribute("data-assemble");
    // The visit isn't spent, so nothing is blocked for later either.
    expect(sessionStorage.getItem(FOOTER_SEEN_KEY)).toBeNull();
  });
});
