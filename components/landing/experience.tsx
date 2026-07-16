import { CompanyLink } from "@/components/company-link";
import { Kicker } from "@/components/kicker";
import { RoleStack } from "@/components/landing/role-stack";
import { LinkedText } from "@/components/linked-text";
import { experience } from "@/data/portfolio";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-20">
      <Kicker label="experience" />
      <div>
        {experience.map((role) => (
          <div
            key={role.id}
            className="border-line grid grid-cols-[16px_1fr] gap-4 border-t border-dashed py-5 first:border-t-0 first:pt-0 sm:grid-cols-[16px_88px_1fr]"
          >
            <div className="flex justify-center pt-1.5">
              <span className="bg-hi size-[9px] rounded-[2px] shadow-[0_0_0_4px_var(--base)]" />
            </div>
            <div className="text-faint hidden pt-0.5 font-mono text-[11.5px] leading-relaxed sm:block">
              <div className="whitespace-nowrap">{role.end}</div>
              <div aria-hidden className="bg-line my-1 ml-[3px] h-3 w-px" />
              <div className="whitespace-nowrap">{role.start}</div>
            </div>
            <div>
              <div className="text-ink text-base font-semibold">
                {role.position}
              </div>
              <div className="text-dim mt-0.5 text-[13.5px]">
                {/* CompanyLink renders a bare text node when a company has no
                    live site, so the name needs its own element to be found by
                    itself rather than as "Connect4 · Full-time". */}
                <span>
                  <CompanyLink company={role.company} />
                </span>{" "}
                · {role.employmentType}
              </div>
              <div className="text-faint mt-1 mb-3 font-mono text-[11px]">
                <span className="sm:hidden">
                  {role.start} – {role.end} ·{" "}
                </span>
                {role.location} · {role.workType}
              </div>
              <p className="text-faint mb-2.5 text-[13.5px] leading-relaxed text-pretty">
                <LinkedText text={role.summary} />
              </p>
              {role.highlights.length > 0 && (
                <ul
                  // Explicit role: Tailwind's preflight sets list-style:none,
                  // and WebKit drops list semantics when it does — without
                  // this, VoiceOver never announces "list, N items".
                  role="list"
                  aria-label={`${role.position} at ${role.company}`}
                  className="mb-3.5 flex flex-col gap-1.5"
                >
                  {/* Keyed by index: the list is static and never reorders or
                      filters, so the index is stable — and unlike a truncated
                      string it cannot collide. */}
                  {role.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="text-dim grid grid-cols-[10px_1fr] gap-2 text-[14.5px] leading-relaxed text-pretty"
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
              <RoleStack lead={role.stack.lead} rest={role.stack.rest} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
