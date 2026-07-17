"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ExternalLink } from "@/components/external-link";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { ModeToggle } from "@/components/mode-toggle";
import { Wordmark } from "@/components/wordmark";
import { profile } from "@/data/portfolio";
import { useDwellFlare } from "@/lib/use-dwell-flare";
import { cn } from "@/lib/utils";

const links = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
] as const;

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
  const flare = useDwellFlare();
  const isActive = (href: string) =>
    href === "/projects" ? pathname.startsWith("/projects") : pathname === href;

  return (
    // overflow-hidden lets the logo below bleed past the bar and get cut by the
    // bottom border, echoing the footer and the social cards.
    <header className="border-line bg-base/80 sticky top-0 z-40 overflow-hidden border-b backdrop-blur">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6 md:px-8">
        {/* self-end puts the mark's bottom on the header's bottom border, so the
            border itself is what cuts it. */}
        {/* The dwell lives on the link, not the mark: the mark is only ~25px of
            a 38px hit area, and a pointer resting in the padding is still
            resting on the logo. */}
        <Link
          href="/about"
          aria-label="akds — home"
          className="-mx-2 self-end px-2"
          {...flare.handlers}
        >
          {/* faint, not ink: softened so the mark sits in the bar rather than
              dominating it. Still a nav link, so it stops well short of the
              footer's ghost — at 38px bold it clears WCAG's 3:1 for large text
              in both themes, and brightens to ink on hover. */}
          <Wordmark
            flare
            runId={flare.runId}
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
      </nav>
    </header>
  );
}
