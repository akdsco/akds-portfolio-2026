"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

// Smoothly animates auto-height with the grid 0fr->1fr trick: no fixed height,
// so content that grows while open (e.g. a testimonial's own "read more") just
// reflows. `inert` when closed keeps clipped content out of tab order / AT.
// transform/opacity-free but grid-template-rows is composited well; honours
// reduced motion.
export function Collapse({
  open,
  id,
  children,
}: {
  open: boolean;
  id?: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
