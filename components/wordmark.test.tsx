import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { Wordmark } from "@/components/wordmark";
import {
  WORDMARK,
  WORDMARK_CLIP_HEIGHT,
  WORDMARK_HOVER_LIFT,
  WORDMARK_LIFT,
  WORDMARK_VISIBLE,
} from "@/lib/wordmark";

const clipBox = (ui: React.ReactElement) =>
  render(ui).container.firstChild as HTMLElement;

/** jsdom folds `calc(0.67em + 0.08em)` to `calc(0.75em)`, so read the number. */
const ems = (value: string) => Number(/(-?[\d.]+)em/.exec(value)?.[1] ?? NaN);

const letters = (box: HTMLElement) =>
  Array.from(box.querySelectorAll<HTMLElement>(".wordmark-letter"));

describe("Wordmark", () => {
  test("renders the mark as one text node when static", () => {
    const box = clipBox(<Wordmark />);
    expect(box).toHaveTextContent(WORDMARK);
    expect(letters(box)).toHaveLength(0);
  });

  test("splits into one span per letter when flaring", () => {
    const box = clipBox(<Wordmark flare />);
    expect(box).toHaveTextContent(WORDMARK);
    expect(letters(box).map((l) => l.textContent)).toEqual(
      Array.from(WORDMARK),
    );
  });

  test("hands each letter its index, so CSS can stagger the sweep", () => {
    const box = clipBox(<Wordmark flare />);
    expect(letters(box).map((l) => l.style.getPropertyValue("--i"))).toEqual([
      "0",
      "1",
      "2",
      "3",
    ]);
  });

  // The crop is the mark. The lift needs room to travel upward, and the only
  // place to find it is above the glyphs — but the clip box's BOTTOM edge is
  // what the nav border cuts against, so it must not move. Hence: grow the box
  // by exactly the lift, and push the text down by the same amount. Distance
  // from text-top to the cut stays WORDMARK_CLIP_HEIGHT either way.
  test("gains headroom for the lift without moving the cut", () => {
    const box = clipBox(<Wordmark flare />);
    // The text starts one paddingTop down, so the cut sits (height - padding)
    // below the glyph tops. That has to equal the plain crop, or the flared
    // mark is cut at a different depth than the footer's and the card's.
    expect(ems(box.style.height) - ems(box.style.paddingTop)).toBeCloseTo(
      WORDMARK_VISIBLE,
    );
    expect(ems(box.style.paddingTop)).toBeCloseTo(WORDMARK_LIFT);
  });

  // The keyframe rises by --wordmark-lift. If it could exceed the headroom the
  // letters would climb into their own clip edge and lose their tops, which is
  // the bug the headroom exists to prevent.
  test("never lets the lift outrun the headroom", () => {
    const box = clipBox(<Wordmark flare />);
    expect(box.style.getPropertyValue("--wordmark-lift")).toBe(
      box.style.paddingTop,
    );
  });

  test("takes no headroom when static", () => {
    const box = clipBox(<Wordmark />);
    expect(box.style.height).toBe(WORDMARK_CLIP_HEIGHT);
    expect(box.style.paddingTop).toBe("");
  });

  // hoverLift opts the mark into the whole-word hover rise: the class the CSS
  // hangs off, and the variable that caps how far the transform travels.
  test("opts into the hover lift and caps its travel", () => {
    const box = clipBox(<Wordmark flare hoverLift />);
    expect(box).toHaveClass("wordmark-hoverlift");
    expect(
      ems(box.style.getPropertyValue("--wordmark-hover-lift")),
    ).toBeCloseTo(WORDMARK_HOVER_LIFT);
  });

  // The hover lift and the flare wave can be on at once (hovered, then dwelled
  // into a flare), so the box must reserve headroom for BOTH — or a waving glyph
  // on a hovered mark climbs past its clip edge. The cut still lands at the same
  // depth: it's the SUM that grows upward, the bottom edge never moves.
  test("stacks headroom for the flare and the hover lift together", () => {
    const box = clipBox(<Wordmark flare hoverLift />);
    expect(ems(box.style.paddingTop)).toBeCloseTo(
      WORDMARK_LIFT + WORDMARK_HOVER_LIFT,
    );
    expect(ems(box.style.height) - ems(box.style.paddingTop)).toBeCloseTo(
      WORDMARK_VISIBLE,
    );
  });

  // Without flare there's no wave, but the hover lift still needs its own room.
  test("reserves headroom for a hover lift even with no flare", () => {
    const box = clipBox(<Wordmark hoverLift />);
    expect(ems(box.style.paddingTop)).toBeCloseTo(WORDMARK_HOVER_LIFT);
    expect(box).not.toHaveAttribute("data-wave");
  });

  // Splitting text into spans drops kerning across the boundaries, which would
  // drift a split mark away from an unsplit one. Pinning kerning off on every
  // surface makes them agree by construction, not by luck.
  test.each([
    ["static", <Wordmark key="s" />],
    ["flare", <Wordmark flare key="f" />],
  ])("disables kerning when %s", (_name, ui) => {
    expect(clipBox(ui).style.fontKerning).toBe("none");
  });

  // Both surfaces run the same wave; the difference is only which trigger arms
  // it. The nav bumps runId per hover (so the keyframe replays); the footer
  // flips play true once at the bottom of the page.
  test("stays still until a trigger arms the wave", () => {
    expect(clipBox(<Wordmark flare />)).not.toHaveAttribute("data-wave");
    expect(clipBox(<Wordmark flare runId={0} />)).not.toHaveAttribute(
      "data-wave",
    );
  });

  test("arms the wave on the nav's runId", () => {
    expect(clipBox(<Wordmark flare runId={1} />)).toHaveAttribute("data-wave");
  });

  test("arms the wave on the footer's play", () => {
    expect(clipBox(<Wordmark flare play />)).toHaveAttribute("data-wave");
  });

  // A trigger does nothing without flare: no split means no letters to animate.
  test("ignores a trigger when not flaring", () => {
    const box = clipBox(<Wordmark play />);
    expect(box).not.toHaveAttribute("data-wave");
    expect(letters(box)).toHaveLength(0);
  });
});
