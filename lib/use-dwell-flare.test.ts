import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { DWELL_MS, FLARE_HOLD_MS, useDwellFlare } from "@/lib/use-dwell-flare";

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

  // Once a flare has fired, leaving no longer cuts it: it holds for the wave's
  // own length so the sweep plays out, then releases back to rest on its own.
  test("a flare under way survives the pointer leaving, then releases on the hold", () => {
    const { result } = renderHook(() => useDwellFlare());
    act(() => {
      result.current.handlers.onPointerEnter();
    });
    advance(DWELL_MS);
    expect(result.current.runId).toBe(1);

    act(() => {
      result.current.handlers.onPointerLeave();
    });
    advance(FLARE_HOLD_MS - 1);
    expect(result.current.runId).toBe(1); // still holding, wave not done

    advance(1);
    expect(result.current.runId).toBe(0); // released
  });

  // Even with the pointer parked the whole time, the flare is a one-shot: it
  // releases once its hold elapses rather than latching lit.
  test("releases on its own once the hold elapses, pointer still parked", () => {
    const { result } = renderHook(() => useDwellFlare());
    act(() => {
      result.current.handlers.onPointerEnter();
    });
    advance(DWELL_MS);
    expect(result.current.runId).toBe(1);

    advance(FLARE_HOLD_MS);
    expect(result.current.runId).toBe(0);
  });

  // Re-dwelling replays: a fresh dwell bumps the run again (which re-keys the
  // letters so the wave actually restarts) and replaces the pending hold.
  test("re-dwelling replays the flare", () => {
    const { result } = renderHook(() => useDwellFlare());
    const dwell = () => {
      act(() => {
        result.current.handlers.onPointerEnter();
      });
      advance(DWELL_MS);
    };

    dwell();
    expect(result.current.runId).toBe(1);
    act(() => {
      result.current.handlers.onPointerLeave();
    });
    // Leaving no longer resets it; the flare is still holding.
    expect(result.current.runId).toBe(1);

    dwell();
    expect(result.current.runId).toBe(2);
  });

  // A press on a phone fires pointerenter too; the flare is a hover easter
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
