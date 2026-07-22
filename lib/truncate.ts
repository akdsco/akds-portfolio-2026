// Cap for a <meta description> / og:description. Google shows ~155–160 chars
// and social cards ~125; capping at the low end of Google's window keeps the
// SERP snippet from being cut mid-word. Single source of truth — the tests
// assert against this same value.
export const META_DESCRIPTION_MAX = 155;

// Trim a plain-text string to fit `max`. Caps at a WORD boundary and appends a
// single ellipsis; strings already within `max` are returned verbatim. `max` is
// inclusive of the ellipsis, so the result length is always ≤ max.
export function truncateForMeta(
  text: string,
  max = META_DESCRIPTION_MAX,
): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1); // leave room for the ellipsis
  const lastSpace = slice.lastIndexOf(" ");
  const trimmed = (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).replace(
    /[\s.,;:!?—–-]+$/u,
    "",
  );
  return `${trimmed}…`;
}
