import { ExternalLink } from "@/components/external-link";
import { Kicker } from "@/components/kicker";
import { LinkedText } from "@/components/linked-text";
import { StackChips } from "@/components/stack-chips";
import { companyHref, experience } from "@/data/portfolio";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-20">
      <Kicker label="experience" />
      <div>
        {experience.map((role) => {
          // null whenever the company has no live site — see companySites.
          const href = companyHref(role.company);
          return (
            <div
              key={role.id}
              className="border-line grid grid-cols-[16px_1fr] gap-4 border-t border-dashed py-5 first:border-t-0 first:pt-0 sm:grid-cols-[16px_120px_1fr]"
            >
              <div className="flex justify-center pt-1.5">
                <span className="bg-hi size-[9px] rounded-[2px] shadow-[0_0_0_4px_var(--base)]" />
              </div>
              <div className="text-faint hidden pt-0.5 font-mono text-[11.5px] leading-relaxed sm:block">
                {role.period}
              </div>
              <div>
                <div className="text-ink text-base font-semibold">
                  {role.position}
                </div>
                <div className="text-dim mt-0.5 text-[13.5px]">
                  {href ? (
                    <ExternalLink href={href}>{role.company}</ExternalLink>
                  ) : (
                    role.company
                  )}
                </div>
                <div className="text-faint mt-1 mb-3 font-mono text-[11px]">
                  <span className="sm:hidden">{role.period} · </span>
                  {role.location} · {role.employmentType}
                </div>
                <p className="text-dim mb-3.5 text-[14.5px] leading-relaxed text-pretty">
                  {role.summary}
                </p>
                {role.highlights.length > 0 && (
                  <ul
                    aria-label={`${role.position} at ${role.company}`}
                    className="mb-3.5 flex flex-col gap-1.5"
                  >
                    {role.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="text-dim grid grid-cols-[10px_1fr] gap-2 text-[13.5px] leading-relaxed text-pretty"
                      >
                        <span
                          aria-hidden
                          className="text-faint font-mono leading-relaxed"
                        >
                          ·
                        </span>
                        <span>
                          <LinkedText text={highlight} />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <StackChips items={role.stack} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
