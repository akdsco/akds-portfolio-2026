import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// PaletteProvider (via HeroPrompt) reads the Next app router; stub it.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import { PaletteProvider } from "@/components/command-palette";
import { Hero } from "@/components/landing/hero";
import { about } from "@/data/portfolio";

// Hero embeds HeroPrompt, which reads the palette context; wrap it so the
// provider is present.
const renderHero = () =>
  render(
    <PaletteProvider>
      <Hero />
    </PaletteProvider>,
  );

// The mono role line under the name is `AI Engineer · TypeScript · Python`. It
// must hold on a single line down to the 375px target and only wrap below that,
// and a "·" must never orphan onto a line of its own — it stays glued to the
// chunk before it. jsdom has no layout, so the wrap point itself is verified in a
// real browser; here we lock the DOM structure that makes that CSS behaviour
// correct: each non-last segment carries its separator inside one nowrap group,
// the last carries none, and nothing re-introduces the old stacking.
describe("Hero role line", () => {
  test("renders each tagline segment", () => {
    renderHero();
    for (const segment of about.tagline) {
      expect(screen.getByText(segment)).toBeInTheDocument();
    }
  });

  test("glues each separator to its preceding segment, none on the last", () => {
    renderHero();
    const groups = about.tagline.map((segment) => {
      // The label sits in its own span; its parent is the nowrap group that
      // also holds the trailing separator.
      const group = screen.getByText(segment).parentElement;
      expect(group).not.toBeNull();
      return group!;
    });

    groups.forEach((group, i) => {
      const isLast = i === groups.length - 1;
      // A non-last group keeps its "·" inside the same nowrap unit so the dot
      // can never start the next line; the last group has no trailing separator.
      expect(group.textContent.includes("·")).toBe(!isLast);
      expect(group.className).toContain("whitespace-nowrap");
    });
  });

  test("does not stack the role line into a flex column", () => {
    const { container } = renderHero();
    const roleLine = screen.getByText("AI Engineer").closest("div");
    expect(roleLine).not.toBeNull();
    expect(roleLine?.className).not.toContain("flex-col");
    // Guard against the old early breakpoint creeping back.
    expect(container.innerHTML).not.toContain("min-[520px]");
  });
});
