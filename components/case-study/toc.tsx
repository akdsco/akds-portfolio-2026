export function Toc({
  sections,
}: {
  sections: { key: string; title: string }[];
}) {
  return (
    <nav className="border-line bg-panel rounded-[10px] border p-4">
      <div className="text-faint mb-3 font-mono text-[10px] tracking-[0.09em] uppercase">
        on this page
      </div>
      <ul className="flex flex-col gap-0.5">
        {sections.map((section, i) => (
          <li key={section.key}>
            <a
              href={`#${section.key}`}
              className="text-dim hover:bg-chip hover:text-ink -mx-2 flex items-baseline gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors"
            >
              <span className="text-hi font-mono text-[11px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{section.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
