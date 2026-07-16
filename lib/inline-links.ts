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
 *
 * Shared instance despite the `/g` flag: `String.replace` and `String.matchAll`
 * both leave `lastIndex` at 0, so the usual stateful-regex trap doesn't apply to
 * either consumer here. It would apply to `.test()`/`.exec()` — if you reach for
 * those, clone it (`new RegExp(INLINE_LINK)`) rather than calling it directly.
 */
export const INLINE_LINK = /\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g;

/**
 * Strips link markup down to its label, for the places a real link can't go:
 * inside another anchor, or in a `<meta>` tag. Leaking raw markup into
 * og:description is worse than shipping no link at all.
 */
export function plainText(text: string): string {
  return text.replace(INLINE_LINK, "$1");
}
