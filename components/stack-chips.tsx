// Monospace tag chips (stacks, skills). Survives wrapping to several rows.
export function StackChips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="border-line bg-chip text-dim hover:border-hi hover:text-ink rounded-[5px] border px-2 py-[3px] font-mono text-[11.5px] transition-colors"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
