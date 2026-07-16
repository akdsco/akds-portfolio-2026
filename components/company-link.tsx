import { ExternalLink, proseLinkClass } from "@/components/external-link";
import { companyHref, type CompanyName } from "@/data/portfolio";

/**
 * A company name — linked when it still has a site, plain text when it doesn't.
 * Owns that branch so the experience list and the case-study meta card can't
 * disagree about how an unlinked company looks.
 */
export function CompanyLink({ company }: { company: CompanyName }) {
  const href = companyHref(company);
  if (!href) return <>{company}</>;

  return (
    <ExternalLink href={href} className={proseLinkClass}>
      {company}
    </ExternalLink>
  );
}
