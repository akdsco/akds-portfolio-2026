"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { ModeToggle } from "@/components/mode-toggle";
import { profile } from "@/data/portfolio";
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
  const isActive = (href: string) =>
    href === "/projects" ? pathname.startsWith("/projects") : pathname === href;

  return (
    <header className="border-line bg-base/80 sticky top-0 z-40 border-b backdrop-blur">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6 md:px-8">
        <Link
          href="/about"
          className="text-ink text-sm font-semibold tracking-tight"
        >
          akds
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
            <a
              key={label}
              href={url}
              aria-label={label}
              target="_blank"
              rel="noreferrer noopener"
              className="text-dim hover:text-ink grid size-8 place-items-center rounded-md transition-colors"
            >
              <Icon className="size-4" />
            </a>
          ))}
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
