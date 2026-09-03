// The hero lede sentence renders with one substring in the coral accent
// (--hi). The split is pure and lives here — not inline in hero.tsx — so it can
// be unit-tested without rendering the whole hero (which pulls the command
// palette, next/image, and friends).
//
// HIGHLIGHT is the phrase to accent; it must be a literal substring of
// `hero.tagline` in data/portfolio.ts. Change one, check the other.
export const HIGHLIGHT = "hard problems";

export type Lede = { before: string; highlight: string; after: string };

/**
 * Split `tagline` around `highlight` into the three render parts. Throws when
 * the phrase isn't present rather than silently dropping the accent and
 * appending the word — a tagline edit that loses the phrase should fail the
 * build/test loudly, not ship a broken lede.
 */
export function splitLede(tagline: string, highlight = HIGHLIGHT): Lede {
  const at = tagline.indexOf(highlight);
  if (at === -1) {
    throw new Error(
      `Hero lede highlight ${JSON.stringify(highlight)} not found in tagline ${JSON.stringify(tagline)}`,
    );
  }
  return {
    before: tagline.slice(0, at),
    highlight,
    after: tagline.slice(at + highlight.length),
  };
}
