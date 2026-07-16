/**
 * Markdown-style `[label](href)` for prose fields in `data/portfolio.ts`.
 *
 * Deliberately the whole grammar — it exists so a sentence can link the thing it
 * names, not to grow into a markdown engine. If prose ever needs emphasis or
 * lists, reach for a real parser rather than bolting cases onto this pattern.
 *
 * The `https://` lives inside the pattern rather than being validated after the
 * fact, so `[x](javascript:…)` is simply not a match and survives as literal
 * text. Safety is a property of the grammar, not a check someone can forget to
 * call. `[^\s)]` stops the href swallowing its own closing paren.
 */
const PATTERN = String.raw`\[([^\]]+)\]\((https:\/\/[^\s)]+)\)`;

/**
 * A fresh regex per call. A shared `/g` instance carries `lastIndex` between
 * callers, which turns "works" into "works every other time" — worth the
 * allocation to make that class of bug impossible.
 */
export const inlineLinkPattern = () => new RegExp(PATTERN, "g");

/**
 * Strips link markup down to its label, for the places a real link can't go:
 * inside another anchor, or in a `<meta>` tag. Leaking raw markup into
 * og:description is worse than shipping no link at all.
 */
export function plainText(text: string): string {
  return text.replace(inlineLinkPattern(), "$1");
}
