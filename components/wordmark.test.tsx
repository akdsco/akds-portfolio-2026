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
  test("renders the mark as one text node when static", () => {
    const box = clipBox(<Wordmark />);
    expect(box).toHaveTextContent(WORDMARK);
    expect(letters(box)).toHaveLength(0);
  });

  test.each([
    ["flare", <Wordmark flare key="f" />],
    ["assemble", <Wordmark assemble key="a" />],
  ])("splits into one span per letter to %s", (_name, ui) => {
    const box = clipBox(ui);
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
  test("gains headroom for the flare's lift without moving the cut", () => {
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
  test("never lets the flare's lift outrun the headroom", () => {
    const box = clipBox(<Wordmark flare />);
    expect(box.style.getPropertyValue("--wordmark-lift")).toBe(
      box.style.paddingTop,
    );
  });

  // The assemble rises from below into rest, so it needs no headroom above —
  // and taking any would shift the footer mark's cut off the nav's and card's.
  test.each([
    ["static", <Wordmark key="s" />],
    ["assemble", <Wordmark assemble key="a" />],
  ])("takes no headroom to %s", (_name, ui) => {
    const box = clipBox(ui);
    expect(box.style.height).toBe(WORDMARK_CLIP_HEIGHT);
    expect(box.style.paddingTop).toBe("");
  });

  // Splitting text into spans drops kerning across the boundaries, which would
  // drift a split mark away from an unsplit one. Pinning kerning off on every
  // surface makes them agree by construction, not by luck.
  test.each([
    ["static", <Wordmark key="s" />],
    ["flare", <Wordmark flare key="f" />],
    ["assemble", <Wordmark assemble key="a" />],
  ])("disables kerning when %s", (_name, ui) => {
    expect(clipBox(ui).style.fontKerning).toBe("none");
  });

  test("marks the flare running only once a run has been triggered", () => {
    expect(clipBox(<Wordmark flare runId={0} />)).not.toHaveAttribute(
      "data-wave",
    );
    expect(clipBox(<Wordmark flare runId={1} />)).toHaveAttribute("data-wave");
  });

  test("marks the assemble running only once told to play", () => {
    expect(clipBox(<Wordmark assemble />)).not.toHaveAttribute("data-assemble");
    expect(clipBox(<Wordmark assemble play />)).toHaveAttribute(
      "data-assemble",
    );
  });

  // The two triggers are independent: an assembling footer mark must never pick
  // up the nav's lift/data-wave, and vice versa.
  test("keeps the flare and assemble attributes from crossing", () => {
    const assembling = clipBox(<Wordmark assemble play />);
    expect(assembling).not.toHaveAttribute("data-wave");
    expect(assembling.style.paddingTop).toBe("");

    const flaring = clipBox(<Wordmark flare runId={1} />);
    expect(flaring).not.toHaveAttribute("data-assemble");
  });
});
