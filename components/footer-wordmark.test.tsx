import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  FOOTER_ENTER_DELAY_MS,
  FOOTER_SEEN_KEY,
  FooterWordmark,
} from "@/components/footer-wordmark";

// The footer plays when the page is scrolled to its bottom, which is pure
// geometry: viewport height + scroll offset vs document height. jsdom has no
// layout, so we set those three numbers by hand and fire a scroll event.
function setScroll({
  scrollY,
  innerHeight = 800,
  scrollHeight = 3000,
}: {
  scrollY: number;
  innerHeight?: number;
  scrollHeight?: number;
}) {
  Object.defineProperty(window, "innerHeight", {
    value: innerHeight,
    configurable: true,
  });
  Object.defineProperty(window, "scrollY", {
    value: scrollY,
    configurable: true,
  });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: scrollHeight,
    configurable: true,
  });
}

/** scrollY that puts the viewport bottom flush with the document bottom. */
const atBottomY = (innerHeight = 800, scrollHeight = 3000) =>
  scrollHeight - innerHeight;

const scroll = () => {
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
};

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
  vi.useFakeTimers();
  sessionStorage.clear();
  stubReducedMotion(false);
  // Start scrolled to the top of a tall page, so nothing fires on mount.
  setScroll({ scrollY: 0 });
});

afterEach(() => {
  vi.useRealTimers();
  sessionStorage.clear();
});

describe("FooterWordmark", () => {
  test("renders the mark and waits, still, at the top of the page", () => {
    const el = mark(<FooterWordmark />);
    expect(el).toHaveTextContent("akds");
    expect(el).not.toHaveAttribute("data-wave");
  });

  test("stays still while the reader is mid-page", () => {
    const el = mark(<FooterWordmark />);
    setScroll({ scrollY: 1200 }); // partway down a 3000px page
    scroll();
    act(() => {
      vi.advanceTimersByTime(FOOTER_ENTER_DELAY_MS);
    });
    expect(el).not.toHaveAttribute("data-wave");
  });

  test("holds a beat after the bottom before it plays", () => {
    const el = mark(<FooterWordmark />);
    setScroll({ scrollY: atBottomY() });
    scroll();
    expect(el).not.toHaveAttribute("data-wave");

    act(() => {
      vi.advanceTimersByTime(FOOTER_ENTER_DELAY_MS - 1);
    });
    expect(el).not.toHaveAttribute("data-wave");
  });

  test("plays after the beat once the bottom is reached, and remembers it", () => {
    const el = mark(<FooterWordmark />);
    setScroll({ scrollY: atBottomY() });
    scroll();
    act(() => {
      vi.advanceTimersByTime(FOOTER_ENTER_DELAY_MS);
    });

    expect(el).toHaveAttribute("data-wave");
    expect(sessionStorage.getItem(FOOTER_SEEN_KEY)).toBeTruthy();
  });

  test("plays on a page too short to scroll (already at its bottom)", () => {
    setScroll({ scrollY: 0, innerHeight: 900, scrollHeight: 850 });
    const el = mark(<FooterWordmark />);
    act(() => {
      vi.advanceTimersByTime(FOOTER_ENTER_DELAY_MS);
    });
    expect(el).toHaveAttribute("data-wave");
  });

  test("drops the pending reveal if the reader leaves before the beat is up", () => {
    const { container, unmount } = render(<FooterWordmark />);
    const el = container.firstChild as HTMLElement;
    setScroll({ scrollY: atBottomY() });
    scroll();
    unmount();

    // The timer must not fire into an unmounted tree, and the visit stays
    // unspent so the next page can still play.
    expect(() => {
      act(() => {
        vi.advanceTimersByTime(FOOTER_ENTER_DELAY_MS);
      });
    }).not.toThrow();
    expect(el).not.toHaveAttribute("data-wave");
    expect(sessionStorage.getItem(FOOTER_SEEN_KEY)).toBeNull();
  });

  test("stays quiet for the rest of the visit once it has played", () => {
    sessionStorage.setItem(FOOTER_SEEN_KEY, "1");
    const el = mark(<FooterWordmark />);
    setScroll({ scrollY: atBottomY() });
    scroll();
    act(() => {
      vi.advanceTimersByTime(FOOTER_ENTER_DELAY_MS);
    });
    expect(el).not.toHaveAttribute("data-wave");
  });

  test("never plays when reduced motion is asked for", () => {
    stubReducedMotion(true);
    const el = mark(<FooterWordmark />);
    setScroll({ scrollY: atBottomY() });
    scroll();
    act(() => {
      vi.advanceTimersByTime(FOOTER_ENTER_DELAY_MS);
    });

    expect(el).not.toHaveAttribute("data-wave");
    // The visit isn't spent, so nothing is blocked for later either.
    expect(sessionStorage.getItem(FOOTER_SEEN_KEY)).toBeNull();
  });
});
