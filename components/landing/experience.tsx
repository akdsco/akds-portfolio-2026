import { Kicker } from "@/components/kicker";
import { StackChips } from "@/components/stack-chips";
import { experience } from "@/data/portfolio";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-20">
      <Kicker label="experience" />
      <div>
        {experience.map((role) => (
          <div
            key={role.id}
            className="border-line grid grid-cols-[16px_1fr] gap-4 border-t border-dashed py-5 sm:grid-cols-[16px_120px_1fr]"
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
                {role.company}
              </div>
              <div className="text-faint mt-1 mb-3 font-mono text-[11px]">
                <span className="sm:hidden">{role.period} · </span>
                {role.location} · {role.employmentType}
              </div>
              <p className="text-dim mb-3.5 text-[14.5px] leading-relaxed text-pretty">
                {role.summary}
              </p>
              <StackChips items={role.stack} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
