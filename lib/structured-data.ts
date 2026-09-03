// schema.org JSON-LD builders. Pure functions off the data layer — every fact
// comes from `data/portfolio.ts` / `lib/site.ts`, so structured data can never
// drift from (or invent beyond) what the site actually says. Rendered via
// `components/json-ld.tsx`; see docs/plans for the mount points.
import { profile, publicSocials } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";

// Site-relative path -> absolute URL. Google drops relative URLs in structured
// data, so every url/item/image field routes through this.
const abs = (path: string): string => new URL(path, SITE_URL).toString();

const SCHEMA = "https://schema.org" as const;

export function webSiteLd() {
  return {
    "@context": SCHEMA,
    "@type": "WebSite",
    name: profile.fullName,
    alternateName: "akds",
    url: SITE_URL,
  } as const;
}

export function profilePageLd() {
  // Lead segment of the stated title ("AI Engineer · …"), not a second
  // hand-kept string — keeps jobTitle tied to the source.
  const jobTitle = profile.title.split("·")[0]?.trim() ?? profile.title;
  return {
    "@context": SCHEMA,
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: profile.fullName,
      jobTitle,
      url: SITE_URL,
      image: abs(profile.brandImage),
      // The surfaced public-identity profiles (GitHub + LinkedIn) — what `sameAs`
      // is for (entity disambiguation). Shares `publicSocials` with the nav so
      // the two never disagree; reference-only profiles stay out.
      sameAs: publicSocials.map((s) => s.url),
    },
  } as const;
}

export type Crumb = { name: string; path: string };

export function breadcrumbLd(items: Crumb[]) {
  return {
    "@context": SCHEMA,
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: abs(crumb.path),
    })),
  } as const;
}
