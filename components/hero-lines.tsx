"use client";

import { useEffect, useRef } from "react";

// Faithful port of the design's fx layer (_fxTick / _fxBlip): thin line "blips"
// spawn at random positions on a ~44px row grid, fade in-and-out once while
// wiping across, then get removed. Mostly very faint, with a rare bright flash.
// Client-only (spawns on the client, so no SSR/hydration output) and disabled
// for prefers-reduced-motion.
export function HeroLines() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let alive = true;
    let tickTimer = 0;
    const pending = new Set<number>();

    const blip = () => {
      if (host.childElementCount > 26) host.firstChild?.remove();
      const s = document.createElement("span");
      s.className = "fx-line";
      const hi = Math.random() < 0.55;
      const len =
        Math.random() < 0.5 ? 9 + Math.random() * 12 : 22 + Math.random() * 30;
      const life = 1400 + Math.random() * 1500;
      const step = 44;
      const rows = Math.max(1, Math.floor((host.clientHeight || 300) / step));
      const row = Math.floor(Math.random() * rows);
      const r = Math.random();
      const peak =
        r < 0.72
          ? 0.2 + Math.random() * 0.16
          : r < 0.95
            ? 0.4 + Math.random() * 0.2
            : 0.8;

      Object.assign(s.style, {
        left: `${(Math.random() * 100).toFixed(2)}%`,
        top: `${row * step + step - 4}px`,
        width: `${Math.round(len)}px`,
        height: `${Math.random() < 0.25 ? 2 : 1.5}px`,
        background: hi ? "var(--hi)" : "var(--fg)",
        animationDuration: `${Math.round(life)}ms`,
      } satisfies Partial<CSSStyleDeclaration>);
      s.style.setProperty("--pk", peak.toFixed(3));
      host.appendChild(s);

      const t = window.setTimeout(() => {
        s.remove();
        pending.delete(t);
      }, life + 60);
      pending.add(t);
    };

    const tick = () => {
      if (!alive) return;
      blip();
      if (Math.random() < 0.2) {
        const t = window.setTimeout(blip, 120 + Math.random() * 220);
        pending.add(t);
      }
      tickTimer = window.setTimeout(tick, 620 + Math.random() * 1100);
    };
    tick();

    return () => {
      alive = false;
      clearTimeout(tickTimer);
      pending.forEach(clearTimeout);
      host.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    />
  );
}
