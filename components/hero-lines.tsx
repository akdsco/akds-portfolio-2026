import type { CSSProperties } from "react";

// Decorative animated line "blips" behind hero content. Deterministic positions
// (no random, so SSR is stable). Hidden entirely for prefers-reduced-motion.
const LINES = [
  { top: 14, left: 6, w: 90, pk: 0.3, delay: 0, dur: 3.4 },
  { top: 28, left: 22, w: 140, pk: 0.22, delay: 1.1, dur: 4.2 },
  { top: 44, left: 4, w: 60, pk: 0.34, delay: 0.6, dur: 3.0 },
  { top: 58, left: 30, w: 110, pk: 0.2, delay: 2.0, dur: 4.6 },
  { top: 72, left: 10, w: 170, pk: 0.26, delay: 0.3, dur: 3.8 },
  { top: 20, left: 55, w: 80, pk: 0.24, delay: 1.6, dur: 4.0 },
  { top: 38, left: 68, w: 120, pk: 0.3, delay: 0.9, dur: 3.3 },
  { top: 64, left: 60, w: 70, pk: 0.22, delay: 2.4, dur: 4.4 },
  { top: 82, left: 40, w: 100, pk: 0.26, delay: 1.3, dur: 3.6 },
  { top: 8, left: 44, w: 130, pk: 0.2, delay: 0.5, dur: 4.1 },
  { top: 50, left: 78, w: 90, pk: 0.3, delay: 1.8, dur: 3.5 },
  { top: 88, left: 14, w: 60, pk: 0.24, delay: 0.2, dur: 3.9 },
];

export function HeroLines() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
    >
      {LINES.map((l) => (
        <span
          key={`${l.top}-${l.left}`}
          className="bg-brand absolute h-px origin-left"
          style={
            {
              top: `${l.top}%`,
              left: `${l.left}%`,
              width: `${l.w}px`,
              animation: `line-blip ${l.dur}s ease-in-out ${l.delay}s infinite`,
              "--pk": l.pk,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
