import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { HeroPrompt, PaletteProvider } from "@/components/command-palette";

// Spies shared with the module mocks — hoisted so the vi.mock factories (which
// run before imports) can close over them.
const { push, setTheme } = vi.hoisted(() => ({
  push: vi.fn(),
  setTheme: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/",
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark", setTheme }),
}));

// Render motion elements as plain DOM: <m.div> -> <div>, AnimatePresence /
// LazyMotion / MotionConfig -> passthrough. Removes exit-animation timing from
// the DOM-presence assertions without changing behaviour.
vi.mock("motion/react", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  const MOTION_PROPS = new Set([
    "initial",
    "animate",
    "exit",
    "transition",
    "variants",
    "whileHover",
    "whileTap",
    "whileFocus",
    "whileInView",
    "layout",
    "layoutId",
    "drag",
  ]);
  const clean = (props: Record<string, unknown>) => {
    const out: Record<string, unknown> = {};
    for (const k in props) if (!MOTION_PROPS.has(k)) out[k] = props[k];
    return out;
  };
  const m = new Proxy(
    {},
    {
      get:
        (_t, tag: string) =>
        (props: { children?: React.ReactNode } & Record<string, unknown>) =>
          React.createElement(tag, clean(props), props.children),
    },
  );
  const Passthrough = ({ children }: { children: React.ReactNode }) => children;
  return {
    __esModule: true,
    m,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    LazyMotion: Passthrough,
    MotionConfig: Passthrough,
    domAnimation: {},
  };
});

beforeEach(() => {
  push.mockClear();
  setTheme.mockClear();
});

function renderPalette() {
  render(
    <PaletteProvider>
      <HeroPrompt command="cat ~/about.md" />
    </PaletteProvider>,
  );
}

const trigger = () =>
  screen.getByRole("button", { name: "Open command palette" });
const input = () => screen.getByRole("combobox", { name: "Type a command" });
const selectedOption = () =>
  screen
    .getAllByRole("option")
    .find((o) => o.getAttribute("aria-selected") === "true");

describe("command palette keyboard + a11y", () => {
  test("opens from the trigger and focuses the input", async () => {
    const user = userEvent.setup();
    renderPalette();
    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(trigger());

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(input()).toHaveFocus();
    // First command is selected by default.
    expect(selectedOption()).toHaveTextContent("/projects");
    expect(input()).toHaveAttribute("aria-activedescendant", "cmd-projects");
  });

  test("ArrowDown moves the active option", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.click(trigger());

    await user.keyboard("{ArrowDown}");

    expect(selectedOption()).toHaveTextContent("/skills");
    expect(input()).toHaveAttribute("aria-activedescendant", "cmd-skills");
  });

  test("Enter runs the highlighted command via the router", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.click(trigger());

    // Default highlight is /projects, whose run() calls router.push.
    await user.keyboard("{Enter}");

    expect(push).toHaveBeenCalledWith("/projects");
  });

  test("Escape closes the palette and restores focus to the trigger", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.click(trigger());
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger()).toHaveFocus();
  });
});
