"use client";

import { Command } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { usePalette } from "@/components/command-palette";
import { ExternalLink } from "@/components/external-link";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { ModeToggle } from "@/components/mode-toggle";
import { Wordmark } from "@/components/wordmark";
import { profile } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const links = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
] as const;

// Movement needed before the bar reacts. Momentum scrolling and iOS
// rubber-banding emit a constant dribble of small deltas in both directions; a
// bar that answers every one of them flickers. Deltas below these accumulate
// instead of being acted on, so it takes a deliberate push either way.
//
// Coming back asks for more than leaving. Reading downwards is a long committed
// motion, so 10px of it clearly means "down". Upward movement is noisier —
// thumb settling, a bounce at the end of a fling — and a bar that reappears on
// every twitch is worse than one that waits to be asked.
const HIDE_THRESHOLD_PX = 10;
const SHOW_THRESHOLD_PX = 15;
// Near the top the bar always shows: overscroll at the top of the document
// reads as downward movement, which would otherwise hide it exactly where it's
// most wanted.
const TOP_ZONE_PX = 80;

/** True while the reader is scrolling down, away from the top of the page. */
function useScrollingDown() {
  const [down, setDown] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const y = window.scrollY;
        const delta = y - last;
        // Leave `last` alone below the threshold so slow movement accumulates
        // rather than being discarded a pixel at a time.
        const needed = delta > 0 ? HIDE_THRESHOLD_PX : SHOW_THRESHOLD_PX;
        if (Math.abs(delta) < needed) return;
        last = y;
        setDown(y > TOP_ZONE_PX && delta > 0);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return down;
}

// Nav shows only GitHub + LinkedIn (the no-contact rule); the rest of
// profile.socials is data only.
const navSocials = profile.socials
  .filter((s) => s.label === "GitHub" || s.label === "LinkedIn")
  .map((s) => ({
    ...s,
    Icon: s.label === "GitHub" ? GithubIcon : LinkedinIcon,
  }));

export function SiteNav() {
  const pathname = usePathname();
  const { open } = usePalette();
  const scrollingDown = useScrollingDown();
  const isActive = (href: string) =>
    href === "/projects" ? pathname.startsWith("/projects") : pathname === href;

  return (
    // overflow-hidden lets the logo below bleed past the bar and get cut by the
    // bottom border, echoing the footer and the social cards.
    <header
      className={cn(
        "border-line bg-base/80 sticky top-0 z-40 overflow-hidden border-b backdrop-blur",
        "transition-transform ease-out motion-reduce:transition-none",
        // The duration is keyed off the state it's moving *to*, so the right one
        // is already on the element when the transform flips. Leaving is brisk;
        // arriving takes its time, which is what reads as smooth rather than
        // snapped-back.
        scrollingDown ? "duration-300" : "duration-[380ms]",
        // Gone while reading down the page, back on any upward intent. It also
        // returns for keyboard focus: a tabbed-to link inside a bar that's slid
        // off-screen is a focus ring nobody can see.
        //
        // :focus-visible, not :focus-within. A mouse click on the theme toggle
        // leaves focus sitting on it, and plain focus-within then pinned the bar
        // open until the next page load — switch theme, and the nav stopped
        // hiding entirely. :focus-visible only matches the keyboard case this is
        // actually for.
        scrollingDown && "-translate-y-full has-[:focus-visible]:translate-y-0",
        // Reduced motion means no travel, so the bar just stays put. The 57px
        // isn't worth sliding a whole landmark past someone who asked for less
        // movement.
        "motion-reduce:translate-y-0",
      )}
    >
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6 md:px-8">
        {/* self-end puts the mark's bottom on the header's bottom border, so the
            border itself is what cuts it. */}
        <Link
          href="/about"
          aria-label="akds — home"
          className="-mx-2 self-end px-2"
        >
          {/* faint, not ink: softened so the mark sits in the bar rather than
              dominating it. Still a nav link, so it stops well short of the
              footer's ghost — at 38px bold it clears WCAG's 3:1 for large text
              in both themes, and brightens to ink on hover. */}
          <Wordmark
            className="text-faint hover:text-ink font-semibold transition-colors"
            style={{ fontSize: 38 }}
          />
        </Link>

        <ul className="flex items-center gap-1 text-[13.5px]">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "rounded-md px-2.5 py-1.5 transition-colors",
                  isActive(href)
                    ? "bg-chip text-ink"
                    : "text-dim hover:text-ink",
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-0.5">
          {/* Under 500px these three don't fit beside the wordmark and the two
              nav links — the bar overflowed and the wordmark ran under "About".
              They fold into the command palette, which already carries all
              three (/github, /linkedin, /theme) and is otherwise unreachable on
              touch: its only hints are "/" and "⌘K". */}
          <button
            type="button"
            onClick={open}
            aria-label="Open command palette"
            className="text-dim hover:text-ink grid size-8 cursor-pointer place-items-center rounded-md transition-colors min-[500px]:hidden"
          >
            <Command className="size-4" />
          </button>

          <div className="hidden items-center gap-0.5 min-[500px]:flex">
            {navSocials.map(({ url, label, Icon }) => (
              <ExternalLink
                key={label}
                href={url}
                aria-label={label}
                className="text-dim hover:text-ink grid size-8 place-items-center rounded-md transition-colors"
              >
                <Icon className="size-4" />
              </ExternalLink>
            ))}
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
