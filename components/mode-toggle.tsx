"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  // Render-time output must not depend on `resolvedTheme`: at SSR it's undefined
  // (it lives in localStorage / matchMedia, both browser-only), so anything keyed
  // off it mismatches on hydration. We render stable markup — generic aria-label
  // plus Sun/Moon whose visibility is driven entirely by the `dark:` CSS variant,
  // which next-themes sets on <html> before hydration. The click handler reads
  // `resolvedTheme` at invocation time, safely past hydration.
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="text-dim hover:text-ink relative grid size-8 cursor-pointer place-items-center rounded-md transition-colors"
    >
      <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
