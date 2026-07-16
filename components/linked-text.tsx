import type { ReactNode } from "react";

import { ExternalLink } from "@/components/external-link";

/**
 * Markdown-style `[label](href)`. Deliberately the whole grammar — this exists so
 * a highlight can link the product it names, not to grow into a markdown engine.
 * If prose ever needs emphasis or lists, reach for a real parser instead of
 * bolting cases onto this regex.
 *
 * The `https://` is inside the pattern rather than validated afterwards, so
 * `[x](javascript:…)` simply isn't a match and falls through as literal text.
 * That makes the safety a property of the grammar instead of a check someone can
 * forget to run. `[^\s)]` keeps the href from swallowing the closing paren.
 */
const LINK = /\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g;

/** Renders a string, turning any `[label](https://…)` into an external link. */
export function LinkedText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(LINK)) {
    const [full, label, href] = match;
    // noUncheckedIndexedAccess: groups are `string | undefined` to the compiler
    // even though the pattern guarantees them. Skip rather than assert.
    if (label === undefined || href === undefined) continue;

    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    nodes.push(
      <ExternalLink key={match.index} href={href}>
        {label}
      </ExternalLink>,
    );
    cursor = match.index + full.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));

  return <>{nodes}</>;
}
