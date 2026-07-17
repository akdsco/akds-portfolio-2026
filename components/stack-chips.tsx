// The chip, in two parts. Exported so a caller needing its own container — one
// with a toggle sitting in the same wrap row, say — can match these exactly,
// without this file becoming a client component on every other caller's behalf.

/** The bare chip. Use `chipHoverClass` too unless the chip can't respond. */
export const chipClass =
  "border-line bg-chip text-dim rounded-[5px] border px-2 py-[3px] font-mono text-[11.5px] transition-colors";

/** How every chip answers the cursor. Composed here so it has one owner. */
export const chipHoverClass = "hover:border-hi hover:text-ink";

// Monospace tag chips (stacks, skills). Survives wrapping to several rows.
export function StackChips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className={`${chipClass} ${chipHoverClass}`}>
          {item}
        </span>
      ))}
    </div>
  );
}
