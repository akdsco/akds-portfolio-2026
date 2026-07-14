"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { profile } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type Command = {
  key: string;
  label: string;
  tag: "go" | "external" | "toggle" | "echo";
  run: () => void;
};

const PaletteContext = createContext<{ open: () => void } | null>(null);

export function usePalette() {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error("usePalette must be used within <PaletteProvider>");
  return ctx;
}

// Subsequence match: every char of the query appears in order in the text.
function fuzzy(query: string, text: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let i = 0;
  for (const ch of t) {
    if (ch === q[i]) i += 1;
    if (i === q.length) return true;
  }
  return false;
}

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

const optionId = (key: string) => `cmd-${key.replace(/[^a-z]/gi, "")}`;

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [echo, setEcho] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const open = useCallback(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    setEcho(null);
    setQuery("");
    setActive(0);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const social = useCallback(
    (label: string) => profile.socials.find((s) => s.label === label)?.url,
    [],
  );

  const commands = useMemo<Command[]>(() => {
    const goto = (href: string) => {
      close();
      router.push(href);
    };
    const openExternal = (url?: string) => {
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      close();
    };
    return [
      {
        key: "/projects",
        label: "Browse all projects",
        tag: "go",
        run: () => goto("/projects"),
      },
      {
        key: "/skills",
        label: "Jump to skills",
        tag: "go",
        run: () => goto("/about#skills"),
      },
      {
        key: "/experience",
        label: "Jump to experience",
        tag: "go",
        run: () => goto("/about#experience"),
      },
      {
        key: "/testimonials",
        label: "Jump to testimonials",
        tag: "go",
        run: () => goto("/about#testimonials"),
      },
      {
        key: "/github",
        label: "Open GitHub",
        tag: "external",
        run: () => openExternal(social("GitHub")),
      },
      {
        key: "/linkedin",
        label: "Open LinkedIn",
        tag: "external",
        run: () => openExternal(social("LinkedIn")),
      },
      {
        key: "/theme",
        label: "Toggle light / dark",
        tag: "toggle",
        run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
      {
        key: "/top",
        label: "Back to the top",
        tag: "go",
        run: () => goto("/about"),
      },
      {
        key: "/whoami",
        label: "Who is this?",
        tag: "echo",
        run: () =>
          setEcho(
            "Arkadiusz Ostrowski: London software engineer. You're reading the long version.",
          ),
      },
    ];
  }, [close, router, setTheme, resolvedTheme, social]);

  const filtered = useMemo(
    () =>
      query.trim()
        ? commands.filter((c) => fuzzy(query.trim(), `${c.key} ${c.label}`))
        : commands,
    [commands, query],
  );

  // Global shortcuts: Cmd/Ctrl+K anywhere; "/" when not typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const cmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      const slash = e.key === "/" && !isTypingTarget(e.target);
      if (cmdK || (slash && !isOpen)) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, open]);

  // Focus the input on open; restore focus to the trigger on close.
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
    else restoreRef.current?.focus();
  }, [isOpen]);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  const activeCmd = filtered[active];

  return (
    <PaletteContext.Provider value={{ open }}>
      {children}
      {isOpen && (
        <div
          className="motion-safe:animate-in motion-safe:fade-in fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[15vh]"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-hi bg-panel flex items-center gap-2 rounded-[9px] border px-3 py-2.5 font-mono text-[13px] shadow-[0_0_0_3px_var(--hi-soft)]">
              <span className="text-brand">$</span>
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-autocomplete="list"
                aria-activedescendant={
                  activeCmd ? optionId(activeCmd.key) : undefined
                }
                aria-label="Type a command"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="type a command…  esc to close"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="text-ink placeholder:text-faint min-w-0 flex-1 bg-transparent outline-none"
              />
            </div>

            <ul
              id="palette-list"
              role="listbox"
              aria-label="Commands"
              className="border-line bg-panel mt-2 max-h-[300px] overflow-auto rounded-[9px] border p-1.5 shadow-[0_18px_44px_-14px_rgba(0,0,0,0.55)]"
            >
              {echo && (
                <li className="text-dim px-2.5 py-2 font-mono text-[12px]">
                  <span className="text-hi">&gt;</span> {echo}
                </li>
              )}
              {filtered.length === 0 ? (
                <li
                  role="option"
                  aria-selected={false}
                  aria-disabled="true"
                  className="text-faint px-2.5 py-2 font-mono text-[12px]"
                >
                  no matching command
                </li>
              ) : (
                filtered.map((c, i) => (
                  <li
                    key={c.key}
                    id={optionId(c.key)}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={c.run}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-2",
                      i === active && "bg-chip",
                    )}
                  >
                    <span className="text-ink min-w-[108px] font-mono text-[12.5px]">
                      {c.key}
                    </span>
                    <span className="text-dim flex-1 text-[12.5px]">
                      {c.label}
                    </span>
                    <span className="text-hi border-line rounded-[4px] border px-1.5 py-0.5 font-mono text-[9.5px] tracking-[0.06em] uppercase">
                      {c.tag}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </PaletteContext.Provider>
  );
}

// The terminal prompt in each hero; opens the palette. `command` is the
// per-page label (e.g. "cat ~/about.md").
export function HeroPrompt({ command }: { command: string }) {
  const { open } = usePalette();
  return (
    <button
      type="button"
      onClick={open}
      aria-haspopup="dialog"
      aria-keyshortcuts="/ Meta+K Control+K"
      aria-label="Open command palette"
      className="text-dim focus-visible:outline-hi inline-flex cursor-pointer items-center gap-2 rounded-[5px] font-mono text-[12.5px] focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <span className="text-brand">$</span>
      <span>{command}</span>
      <span className="bg-brand animate-blink inline-block h-[15px] w-2 translate-y-0.5" />
      <span className="ml-2 hidden items-center gap-2 sm:flex">
        <span className="text-faint">try</span>
        <kbd className="border-line text-dim rounded-[5px] border px-1.5 py-px text-[11px]">
          /
        </kbd>
        <span className="text-faint">or</span>
        <kbd className="border-line text-dim rounded-[5px] border px-1.5 py-px text-[11px]">
          ⌘K
        </kbd>
      </span>
    </button>
  );
}
