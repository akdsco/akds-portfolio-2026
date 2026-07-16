import { ExternalLink } from "@/components/external-link";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { profile } from "@/data/portfolio";

const footerSocials = profile.socials
  .filter((s) => s.label === "GitHub" || s.label === "LinkedIn")
  .map((s) => ({
    ...s,
    Icon: s.label === "GitHub" ? GithubIcon : LinkedinIcon,
  }));

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-line border-t">
      <div className="text-faint mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 text-[12.5px] sm:flex-row md:px-8">
        <span className="font-mono">
          © {year} {profile.fullName}
        </span>
        <div className="flex items-center gap-2">
          {footerSocials.map(({ url, label, Icon }) => (
            <ExternalLink
              key={label}
              href={url}
              aria-label={label}
              className="hover:text-ink grid size-8 place-items-center rounded-md transition-colors"
            >
              <Icon className="size-4" />
            </ExternalLink>
          ))}
        </div>
      </div>
    </footer>
  );
}
