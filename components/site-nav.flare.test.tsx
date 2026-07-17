import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { PaletteProvider } from "@/components/command-palette";
import { SiteNav } from "@/components/site-nav";
import { DWELL_MS } from "@/lib/use-dwell-flare";

vi.mock("next/navigation", () => ({
  usePathname: () => "/about",
  useRouter: () => ({ push: vi.fn() }),
}));

// The palette provider carries a /theme command backed by next-themes.
vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark", setTheme: vi.fn() }),
}));

// SiteNav reads the palette context (the command-palette button), so it has to
// render inside its provider.
const renderNav = () =>
  render(
    <PaletteProvider>
      <SiteNav />
    </PaletteProvider>,
  );

const logo = () => screen.getByRole("link", { name: /home/i });
const mark = () => logo().firstElementChild as HTMLElement;

const advance = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

beforeEach(() => {
  vi.useFakeTimers();
  // The stub in vitest.setup.ts answers `false` to everything, which would fail
  // the hover guard. This nav is being tested as it behaves on a desktop.
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: !query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
});

afterEach(() => {
  vi.useRealTimers();
});

describe("SiteNav wordmark flare", () => {
  test("sits still until the pointer has dwelled", () => {
    renderNav();
    expect(mark()).not.toHaveAttribute("data-wave");

    act(() => {
      logo().dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    });
    advance(DWELL_MS - 1);
    expect(mark()).not.toHaveAttribute("data-wave");
  });

  test("flares once the pointer has dwelled, and stops when it leaves", () => {
    renderNav();
    act(() => {
      logo().dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    });
    advance(DWELL_MS);
    expect(mark()).toHaveAttribute("data-wave");

    act(() => {
      logo().dispatchEvent(new PointerEvent("pointerout", { bubbles: true }));
    });
    expect(mark()).not.toHaveAttribute("data-wave");
  });
});
