import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * An outbound link. Single home for the `target`/`rel` pair so the two callers
 * (company names, inline links in prose) can't drift apart — `noopener` matters
 * on every one of them, and it's the sort of thing that goes missing when each
 * site hand-rolls its own anchor.
 */
export function ExternalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "decoration-line hover:text-hi hover:decoration-hi underline decoration-dotted underline-offset-[3px] transition-colors",
        className,
      )}
    >
      {children}
    </a>
  );
}
