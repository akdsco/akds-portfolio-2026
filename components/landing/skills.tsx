import { Kicker } from "@/components/kicker";
import { StackChips } from "@/components/stack-chips";
import { skills } from "@/data/portfolio";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-20">
      <Kicker label="skills" />
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {skills.map((category) => (
          <div key={category.title}>
            <div className="border-line text-ink mb-3 border-b border-dashed pb-2.5 text-sm font-semibold">
              {category.title}
            </div>
            <StackChips items={category.items} />
          </div>
        ))}
      </div>
    </section>
  );
}
