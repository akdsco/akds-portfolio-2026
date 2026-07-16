import { cn } from "@/lib/utils";

// The chip itself. Exported so a caller needing its own container — one with a
// toggle sitting in the same wrap row, say — can match it, without this file
// becoming a client component on every other caller's behalf.
export const chipClass =
  "border-line bg-chip text-dim rounded-[5px] border px-2 py-[3px] font-mono text-[11.5px] transition-colors";

// Monospace tag chips (stacks, skills). Survives wrapping to several rows.
export function StackChips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className={cn(chipClass, "hover:border-hi hover:text-ink")}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
