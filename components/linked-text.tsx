import type { ReactNode } from "react";

import { ExternalLink } from "@/components/external-link";
import { inlineLinkPattern } from "@/lib/inline-links";

/**
 * Renders a prose string, turning any `[label](https://…)` into an external
 * link. Use this for every prose field that's rendered as its own text node —
 * summaries, highlights, case-study paragraphs, quotes.
 *
 * Two places it must NOT be used, where `plainText()` is the answer instead:
 * inside another anchor (nested `<a>` is invalid HTML), and in `<meta>` content.
 */
export function LinkedText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(inlineLinkPattern())) {
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
