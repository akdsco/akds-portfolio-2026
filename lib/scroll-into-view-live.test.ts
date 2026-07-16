import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { scrollIntoViewLive } from "@/lib/scroll-into-view-live";

// jsdom has no layout — every rect is 0×0 and scrollY never moves — so where
// the scroll *lands* can't be asserted here without inventing the geometry it
// would be measuring. That part is verified against a real browser. What is
// real logic, and what shipped broken once, is when the glide hands control
// back to the user.

let el: HTMLElement;
let cancel: () => void;

beforeEach(() => {
  vi.mocked(window.scrollTo).mockClear();
  el = document.createElement("section");
  document.body.appendChild(el);
});

afterEach(() => {
  cancel?.();
  el.remove();
});

// Let a frame pass, then report whether the glide is still driving the scroll.
async function stillScrolling() {
  vi.mocked(window.scrollTo).mockClear();
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  return vi.mocked(window.scrollTo).mock.calls.length > 0;
}

function press(key: string) {
  window.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}

describe("scrollIntoViewLive", () => {
  test("drives the scroll once started", async () => {
    cancel = scrollIntoViewLive(el, 300);
    expect(await stillScrolling()).toBe(true);
  });

  test.each(["ArrowDown", "PageUp", "Home", " "])(
    "%s means the user took over, so it stops",
    async (key) => {
      cancel = scrollIntoViewLive(el, 300);
      press(key);
      expect(await stillScrolling()).toBe(false);
    },
  );

  test.each(["Enter", "k", "Escape", "Shift"])(
    "%s doesn't scroll anything, so it keeps going",
    async (key) => {
      cancel = scrollIntoViewLive(el, 300);
      press(key);
      expect(await stillScrolling()).toBe(true);
    },
  );

  // The regression: the command palette dispatches its jump from the Enter
  // keydown that selects the command, and that keydown is still bubbling up to
  // window when the glide attaches its listeners. Cancelling on any key killed
  // the scroll on the very keystroke that asked for it.
  test("survives the keydown it was started from", async () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.addEventListener("keydown", () => {
      cancel = scrollIntoViewLive(el, 300);
    });
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );

    expect(await stillScrolling()).toBe(true);
    input.remove();
  });

  test("stops when cancelled", async () => {
    cancel = scrollIntoViewLive(el, 300);
    cancel();
    expect(await stillScrolling()).toBe(false);
  });

  test("jumps without animating under reduced motion", async () => {
    vi.mocked(window.matchMedia).mockReturnValueOnce({
      matches: true,
    } as unknown as MediaQueryList);

    cancel = scrollIntoViewLive(el, 300);
    // One frame to let the caller's state reach the DOM, then a single move.
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(await stillScrolling()).toBe(false);
  });
});
