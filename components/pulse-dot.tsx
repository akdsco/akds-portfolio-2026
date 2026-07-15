import { cn } from "@/lib/utils";

/**
 * Decorative "live status" dot with a soft pulse + glow.
 *
 * Self-aligns to the optical centre of the *first* line of adjacent text: the
 * `h-[1lh]` wrapper is exactly one line-height tall and centres the dot within
 * it, so a row set to `items-start` lands the dot on the first line regardless
 * of font size or whether the text wraps — no magic top-margin needed.
 */
export function PulseDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("flex h-[1lh] shrink-0 items-center", className)}
    >
      <span className="bg-hi animate-pulse-dot size-[7px] rounded-full shadow-[0_0_8px_var(--hi)]" />
    </span>
  );
}
