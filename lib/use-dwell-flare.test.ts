import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { DWELL_MS, useDwellFlare } from "@/lib/use-dwell-flare";

/**
 * The hook reads the environment at event time, never at render — markup keyed
 * off matchMedia mismatches on hydration (see CLAUDE.md). So these stubs can be
 * swapped per test without re-rendering.
 */
function stubMedia({ hover = true, reduce = false } = {}) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? reduce : hover,
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

const advance = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

beforeEach(() => {
  vi.useFakeTimers();
  stubMedia();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useDwellFlare", () => {
  test("does not fire before the dwell is up", () => {
    const { result } = renderHook(() => useDwellFlare());
    act(() => {
      result.current.handlers.onPointerEnter();
    });

    advance(DWELL_MS - 1);
    expect(result.current.runId).toBe(0);
  });

  test("fires once the pointer has dwelled", () => {
    const { result } = renderHook(() => useDwellFlare());
    act(() => {
      result.current.handlers.onPointerEnter();
    });

    advance(DWELL_MS);
    expect(result.current.runId).toBe(1);
  });

  test("a pointer that leaves a tick early never fires", () => {
    const { result } = renderHook(() => useDwellFlare());
    act(() => {
      result.current.handlers.onPointerEnter();
    });
    advance(DWELL_MS - 1);
    act(() => {
      result.current.handlers.onPointerLeave();
    });

    advance(DWELL_MS);
    expect(result.current.runId).toBe(0);
  });

  test("leaving mid-sweep cuts it short", () => {
    const { result } = renderHook(() => useDwellFlare());
    act(() => {
      result.current.handlers.onPointerEnter();
    });
    advance(DWELL_MS);
    expect(result.current.runId).toBe(1);

    act(() => {
      result.current.handlers.onPointerLeave();
    });
    expect(result.current.runId).toBe(0);
  });

  // The flare doesn't latch: leaving and coming back arms it afresh. The run
  // passing back through 0 on the way out is also what re-keys the letters, so
  // the second sweep actually replays rather than sitting finished.
  test("re-dwelling runs it again", () => {
    const { result } = renderHook(() => useDwellFlare());
    const dwell = () => {
      act(() => {
        result.current.handlers.onPointerEnter();
      });
      advance(DWELL_MS);
    };

    dwell();
    act(() => {
      result.current.handlers.onPointerLeave();
    });
    expect(result.current.runId).toBe(0);

    dwell();
    expect(result.current.runId).toBeGreaterThan(0);
  });

  // A 3s press on a phone fires pointerenter too; the flare is a hover easter
  // egg, not something to trigger by holding the logo.
  test("never fires without a real hovering pointer", () => {
    stubMedia({ hover: false });
    const { result } = renderHook(() => useDwellFlare());
    act(() => {
      result.current.handlers.onPointerEnter();
    });

    advance(DWELL_MS);
    expect(result.current.runId).toBe(0);
  });

  test("never fires when reduced motion is asked for", () => {
    stubMedia({ reduce: true });
    const { result } = renderHook(() => useDwellFlare());
    act(() => {
      result.current.handlers.onPointerEnter();
    });

    advance(DWELL_MS);
    expect(result.current.runId).toBe(0);
  });

  // A pending timer firing into an unmounted tree is a React warning at best.
  test("drops a pending dwell on unmount", () => {
    const { result, unmount } = renderHook(() => useDwellFlare());
    act(() => {
      result.current.handlers.onPointerEnter();
    });
    unmount();

    expect(() => {
      advance(DWELL_MS);
    }).not.toThrow();
    expect(vi.getTimerCount()).toBe(0);
  });
});
