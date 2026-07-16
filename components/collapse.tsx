"use client";

import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

// Keep in sync with duration-300 below.
const ROWS_MS = 300;

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
  // The clip box is only needed while the rows are moving. Left on, it also
  // slices anything a child paints outside its own box — card hover shadows got
  // cut flat against the panel's edges. So drop it once the rows have settled,
  // and put it back the moment we start closing.
  const [settled, setSettled] = useState(false);
  const clipped = !open || !settled;

  // Timed rather than driven by transitionend: if `open` flips before the
  // browser has painted the closed state — a hash landing that reveals on
  // mount — the rows jump with no transition, so transitionend never fires and
  // the clip would never lift. A timer settles either way, and covers reduced
  // motion (no transition at all) for free.
  useEffect(() => {
    const t = setTimeout(
      () => {
        setSettled(open);
      },
      open ? ROWS_MS : 0,
    );
    return () => {
      clearTimeout(t);
    };
  }, [open]);

  return (
    <div
      id={id}
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div
        className={cn(
          "min-h-0",
          clipped ? "overflow-hidden" : "overflow-visible",
        )}
      >
        {children}
      </div>
    </div>
  );
}
