"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  // Render-time output must not depend on `resolvedTheme`: at SSR it's
  // undefined (the resolved theme lives in localStorage / matchMedia,
  // both browser-only), so anything we key off it will mismatch on
  // hydration. We render a single, stable markup: a generic aria-label
  // plus Sun/Moon icons whose visibility is driven entirely by the
  // `dark:` CSS variant. next-themes sets the `class` on <html> via an
  // inline script before React hydrates, so the correct icon is already
  // visible on first paint with no JS-driven swap. The click handler
  // reads `resolvedTheme` at invocation time, by which point we're
  // safely past hydration.
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
