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
  // Memoised per tag. Returning a fresh component from the proxy on every
  // access gives React a new element type each render, so it unmounts and
  // remounts the subtree — which silently drops focus from the input between
  // keystrokes, and makes anything that types read as "the app ignored me".
  const makeTag = (tag: string) => {
    const Tag = function MotionTag(
      props: { children?: React.ReactNode } & Record<string, unknown>,
    ) {
      return React.createElement(tag, clean(props), props.children);
    };
    Tag.displayName = `m.${tag}`;
    return Tag;
  };
  const tags = new Map<string, ReturnType<typeof makeTag>>();
  const m = new Proxy(
    {},
    {
      get: (_t, tag: string) => {
        let Tag = tags.get(tag);
        if (!Tag) {
          Tag = makeTag(tag);
          tags.set(tag, Tag);
        }
        return Tag;
      },
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
  vi.mocked(window.scrollTo).mockClear();
});

function renderPalette() {
  render(
    <PaletteProvider>
      <HeroPrompt command="cat ~/about.md" />
    </PaletteProvider>,
  );
}

// Match by role + the stable part of the name, not the full copy: the visible
// command leads the accessible name, so pin only "command palette".
const trigger = () => screen.getByRole("button", { name: /command palette/i });
const input = () => screen.getByRole("combobox", { name: "Type a command" });
const selectedOption = () =>
  screen
    .getAllByRole("option")
    .find((o) => o.getAttribute("aria-selected") === "true");

describe("command palette keyboard + a11y", () => {
  // WCAG 2.5.3 (Label in Name): the accessible name must contain the visible
  // label so a voice-control user can activate the control by what they read.
  // The trigger's visible label IS its terminal command.
  test("trigger's accessible name includes its visible command", () => {
    renderPalette();
    // getByRole computes the accessible name; a regex on the visible command
    // proves the name is not divorced from what's on screen.
    expect(
      screen.getByRole("button", { name: /cat ~\/about\.md/i }),
    ).toBeInTheDocument();
    // ...and it still says what the control does.
    expect(
      screen.getByRole("button", { name: /command palette/i }),
    ).toBeInTheDocument();
  });

  test("opens from the trigger and focuses the input", async () => {
    const user = userEvent.setup();
    renderPalette();
    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(trigger());

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(input()).toHaveFocus();
    // First command is selected by default; the list leads with the nav's own
    // order, so that's /about.
    expect(selectedOption()).toHaveTextContent("/about");
    expect(input()).toHaveAttribute("aria-activedescendant", "cmd-about");
  });

  test("ArrowDown moves the active option", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.click(trigger());

    await user.keyboard("{ArrowDown}");

    expect(selectedOption()).toHaveTextContent("/projects");
    expect(input()).toHaveAttribute("aria-activedescendant", "cmd-projects");
  });

  test("Enter runs the highlighted command via the router", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.click(trigger());

    // Default highlight is /about, whose run() calls router.push.
    await user.keyboard("{Enter}");

    expect(push).toHaveBeenCalledWith("/about");
  });

  // "Back to the top" used to mean "go to /about" from anywhere that wasn't
  // /about, so on /projects it walked you off the page instead of scrolling it.
  // usePathname is mocked to "/" above — not /about — which is exactly the case
  // that was wrong.
  test("/top scrolls the page you're on, and doesn't navigate", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.click(trigger());

    await user.type(input(), "top");
    await user.keyboard("{Enter}");

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
    expect(push).not.toHaveBeenCalled();
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
