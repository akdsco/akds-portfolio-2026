import type { ReactNode } from "react";

/**
 * Styling for a link sitting in a run of prose — company names, inline links.
 * Kept next to ExternalLink so the two callers that want this look share one
 * string; icon links (nav, footer) style themselves instead.
 *
 * The radius is only ever seen as the focus ring: the ring is an outline, an
 * outline follows its element's own radius, and prose links are the one surface
 * with no box of their own to have set one — so theirs came out square next to
 * every rounded ring on the site. Smaller than the nav's, because it wraps a run
 * of text rather than a button.
 */
export const proseLinkClass =
  "decoration-line hover:text-hi hover:decoration-hi rounded-sm underline decoration-dotted underline-offset-[3px] transition-colors";

/**
 * Every outbound link goes through here. It carries no visual opinion — its one
 * job is that `target="_blank"` never ships without `rel="noopener noreferrer"`,
 * which is exactly the pair that goes missing when each call site hand-rolls its
 * own anchor. Pass `className` for looks; `proseLinkClass` for prose.
 */
export function ExternalLink({
  href,
  className,
  "aria-label": ariaLabel,
  children,
}: {
  href: string;
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </a>
  );
}
