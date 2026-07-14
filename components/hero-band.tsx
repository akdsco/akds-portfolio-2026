import type { ReactNode } from "react";

import { HeroLines } from "@/components/hero-lines";
import { cn } from "@/lib/utils";

// Shared hero band: a bordered, relative section with the static scanline and
// the animated line-blip fx behind a centered content container. Every page's
// hero uses this so they all behave identically. `className` tunes the content
// container (max-width, vertical padding).
export function HeroBand({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-line relative border-b">
      <div className="scanline pointer-events-none absolute inset-0" />
      <HeroLines />
      <div className={cn("reveal relative mx-auto px-6 md:px-10", className)}>
        {children}
      </div>
    </section>
  );
}
