// Trim a plain-text string to a length that sits cleanly in a <meta
// description> / og:description. Google shows ~155–160 chars and social cards
// ~125, so an untrimmed 190-char hook gets cut mid-word. This caps the emitted
// string at a WORD boundary and appends a single ellipsis; strings already
// within `max` are returned verbatim. `max` is inclusive of the ellipsis, so
// the result length is always ≤ max.
export function truncateForMeta(text: string, max = 155): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1); // leave room for the ellipsis
  const lastSpace = slice.lastIndexOf(" ");
  const trimmed = (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).replace(
    /[\s.,;:!?—–-]+$/u,
    "",
  );
  return `${trimmed}…`;
}
