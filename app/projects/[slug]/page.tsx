import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MetaCard } from "@/components/case-study/meta-card";
import { Toc } from "@/components/case-study/toc";
import { Kicker } from "@/components/kicker";
import { projects, testimonials, type CaseStudy } from "@/data/portfolio";

const SECTION_ORDER = [
  { key: "problem", kicker: "the situation", title: "Problem" },
  { key: "constraints", kicker: "the guardrails", title: "Constraints" },
  { key: "approach", kicker: "how it was built", title: "Approach" },
  { key: "contribution", kicker: "my lane", title: "Contribution" },
  { key: "outcome", kicker: "the result", title: "Outcome" },
  { key: "reflection", kicker: "what mattered", title: "Reflection" },
] as const;

const caseStudies = projects.filter((p) => p.caseStudy);

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = caseStudies.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — Arkadiusz Ostrowski`,
    description: project.hook,
  };
}

function sectionsOf(cs: CaseStudy) {
  return SECTION_ORDER.map((s) => ({
    ...s,
    paragraphs: cs.sections[s.key] ?? [],
  })).filter((s) => s.paragraphs.length > 0);
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = caseStudies.find((p) => p.slug === slug);
  if (!project?.caseStudy) notFound();

  const cs = project.caseStudy;
  const sections = sectionsOf(cs);
  const testimonial =
    cs.testimonialId != null
      ? testimonials.find((t) => t.id === cs.testimonialId)
      : undefined;

  return (
    <>
      <section className="border-line relative border-b">
        <div className="scanline pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[900px] px-6 py-10 md:px-11">
          <Link
            href="/projects"
            className="text-faint hover:text-ink mb-6 inline-flex items-center gap-2 font-mono text-[12.5px] transition-colors"
          >
            <span className="text-brand">$</span> cd ~/projects
          </Link>
          <h1 className="text-ink mb-4 text-4xl font-semibold tracking-tight sm:text-[46px]">
            {project.title}
          </h1>
          <p className="text-dim max-w-2xl text-xl leading-relaxed text-pretty">
            {project.hook}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-[900px] items-start gap-11 px-6 py-11 md:px-11 lg:grid-cols-[1fr_252px]">
        <div className="min-w-0">
          {sections.map((section) => (
            <section
              key={section.key}
              id={section.key}
              className="mb-10 scroll-mt-20"
            >
              <Kicker label={section.kicker} />
              <h2 className="text-ink mb-3.5 text-2xl font-semibold tracking-tight">
                {section.title}
              </h2>
              {section.paragraphs.map((para) => (
                <p
                  key={para.slice(0, 24)}
                  className="text-dim mb-4 text-[16.5px] leading-relaxed text-pretty"
                >
                  {para}
                </p>
              ))}
            </section>
          ))}

          {testimonial && (
            <figure className="border-line bg-panel m-0 rounded-[10px] border p-6">
              <div className="text-hi mb-3 font-mono text-[11px] tracking-[0.11em] uppercase">
                {"// endorsement"}
              </div>
              <blockquote className="text-ink mb-4 text-lg leading-relaxed text-pretty">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="text-faint font-mono text-xs">
                <span className="text-ink">{testimonial.author}</span> ·{" "}
                {testimonial.designation}
              </figcaption>
            </figure>
          )}
        </div>

        <aside className="flex flex-col gap-3.5 lg:sticky lg:top-20">
          <MetaCard project={project} />
          {sections.length > 1 && <Toc sections={sections} />}
        </aside>
      </div>
    </>
  );
}
