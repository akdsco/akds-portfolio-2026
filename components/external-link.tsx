import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Styling for a link sitting in a run of prose — company names, inline links.
 * Kept next to ExternalLink so the two callers that want this look share one
 * string; icon links (nav, footer) style themselves instead.
 */
export const proseLinkClass =
  "decoration-line hover:text-hi hover:decoration-hi underline decoration-dotted underline-offset-[3px] transition-colors";

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
      className={cn(className)}
    >
      {children}
    </a>
  );
}
