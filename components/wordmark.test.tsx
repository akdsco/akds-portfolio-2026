import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { Wordmark } from "@/components/wordmark";
import {
  WORDMARK,
  WORDMARK_CLIP_HEIGHT,
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
  test("renders the mark as one text node when not animated", () => {
    const box = clipBox(<Wordmark />);
    expect(box).toHaveTextContent(WORDMARK);
    expect(letters(box)).toHaveLength(0);
  });

  test("splits into one span per letter when animated", () => {
    const box = clipBox(<Wordmark animated />);
    expect(box).toHaveTextContent(WORDMARK);
    expect(letters(box).map((l) => l.textContent)).toEqual(
      Array.from(WORDMARK),
    );
  });

  test("hands each letter its index, so CSS can stagger the sweep", () => {
    const box = clipBox(<Wordmark animated />);
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
    const box = clipBox(<Wordmark animated />);
    // The text starts one paddingTop down, so the cut sits (height - padding)
    // below the glyph tops. That has to equal the plain crop, or the animated
    // mark is cut at a different depth than the footer's and the card's.
    expect(ems(box.style.height) - ems(box.style.paddingTop)).toBeCloseTo(
      WORDMARK_VISIBLE,
    );
    expect(ems(box.style.paddingTop)).toBeCloseTo(WORDMARK_LIFT);
  });

  test("takes no headroom when not animated", () => {
    const box = clipBox(<Wordmark />);
    expect(box.style.height).toBe(WORDMARK_CLIP_HEIGHT);
    expect(box.style.paddingTop).toBe("");
  });

  // Splitting text into spans drops kerning across the boundaries, which would
  // drift the nav's mark away from the footer's and the card's. Pinning kerning
  // off on every surface makes them agree by construction, not by luck.
  test("disables kerning whether split or not", () => {
    expect(clipBox(<Wordmark />).style.fontKerning).toBe("none");
    expect(clipBox(<Wordmark animated />).style.fontKerning).toBe("none");
  });

  test("marks the sweep as running only once a run has been triggered", () => {
    expect(clipBox(<Wordmark animated runId={0} />)).not.toHaveAttribute(
      "data-wave",
    );
    expect(clipBox(<Wordmark animated runId={1} />)).toHaveAttribute(
      "data-wave",
    );
  });
});
