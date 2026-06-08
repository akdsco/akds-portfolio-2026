import Link from "next/link";

import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/projects", label: "Projects" },
] as const;

const socials = [
  {
    href: "https://github.com/akdsco",
    label: "GitHub",
    Icon: GithubIcon,
  },
  {
    href: "https://www.linkedin.com/in/akds",
    label: "LinkedIn",
    Icon: LinkedinIcon,
  },
] as const;

export function SiteNav() {
  return (
    <header className="border-b">
      <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          akds
        </Link>

        <ul className="flex items-center gap-1 text-sm">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-muted-foreground hover:text-foreground rounded-md px-2 py-1 transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noreferrer noopener"
              className={buttonVariants({ variant: "ghost", size: "icon" })}
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
