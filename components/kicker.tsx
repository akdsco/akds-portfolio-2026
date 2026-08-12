// The "◇ LABEL ────" section header used across the site.
export function Kicker({ label }: { label: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="bg-hi size-[7px] rotate-45" />
      <span className="text-faint font-mono text-[11px] tracking-[0.11em] uppercase">
        {label}
      </span>
      <span className="border-line flex-1 border-t border-dashed" />
    </div>
  );
}
