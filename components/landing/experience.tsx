import { Kicker } from "@/components/kicker";
import { RoleStack } from "@/components/landing/role-stack";
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
            {/* End over start, reading down the way the page reads down, so a
                scan follows the dates backwards in time. Stacked also means a
                month can't wrap onto a line of its own. */}
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
                {role.company}
              </div>
              <div className="text-faint mt-1 mb-3 font-mono text-[11px]">
                <span className="sm:hidden">
                  {role.start} – {role.end} ·{" "}
                </span>
                {role.location} · {role.employmentType}
              </div>
              {/* Summary sets the scene in one line and stays quiet; the
                  highlights are what the reader is here for. */}
              <p className="text-faint mb-2.5 text-[13.5px] leading-relaxed text-pretty">
                {role.summary}
              </p>
              <ul className="text-dim marker:text-hi mb-3.5 list-disc space-y-1.5 pl-4 text-[14.5px] leading-relaxed">
                {role.highlights.map((h) => (
                  <li key={h} className="text-pretty">
                    {h}
                  </li>
                ))}
              </ul>
              <RoleStack lead={role.stack.lead} rest={role.stack.rest} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
