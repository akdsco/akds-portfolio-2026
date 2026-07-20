import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HeroPrompt } from "@/components/command-palette";
import { HeroBand } from "@/components/hero-band";
import { LinkedText } from "@/components/linked-text";
import { MetaCard } from "@/components/case-study/meta-card";
import { Toc } from "@/components/case-study/toc";
import { Kicker } from "@/components/kicker";
import { projects, testimonials, type CaseStudy } from "@/data/portfolio";
import { plainText } from "@/lib/inline-links";
import { OG_SHARED } from "@/lib/site";
import { cn } from "@/lib/utils";

const SECTION_ORDER = [
  { key: "problem", kicker: "where it started", title: "Problem" },
  { key: "constraints", kicker: "what made it hard", title: "Constraints" },
  { key: "approach", kicker: "how it was built", title: "Approach" },
  { key: "contribution", kicker: "my lane", title: "Contribution" },
  { key: "outcome", kicker: "how it landed", title: "Outcome" },
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
  // Meta tags are plain text: any inline-link markup in the hook has to collapse
  // to its label, or og:description ships "[SlateIQ](https://…)" verbatim.
  const description = plainText(project.hook);
  return {
    // The readable project name, so the tab reads "akds : AI-powered research
    // assistant" rather than the slug. og:title is pinned to the same name just
    // below, independent of this, so the shared card is unaffected either way.
    title: project.title,
    description,
    alternates: { canonical: `/projects/${slug}` },
    // This block REPLACES the layout's openGraph rather than merging into it,
    // so siteName and locale have to be repeated or they're simply absent.
    //
    // Deliberately NO `images` key: this segment owns an opengraph-image.tsx, so
    // Next injects the per-project card automatically — but only while no level
    // declares `images` itself. Setting it here would silently override every
    // case study with the generic card.
    openGraph: {
      ...OG_SHARED,
      title: project.title,
      description,
      type: "article",
      url: `/projects/${slug}`,
    },
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
      <HeroBand className="max-w-[900px] py-10 md:px-11">
        <div className="mb-6">
          <HeroPrompt command={`cat ~/projects/${slug}.md`} />
        </div>
        <h1 className="text-ink mb-4 text-4xl font-semibold tracking-tight sm:text-[46px]">
          {project.title}
        </h1>
        <p className="text-dim max-w-2xl text-xl leading-relaxed text-pretty">
          <LinkedText text={project.hook} />
        </p>
      </HeroBand>

      <div className="mx-auto grid max-w-[900px] items-start gap-11 px-6 pt-11 pb-6 md:px-11 lg:grid-cols-[1fr_252px]">
        {/* Mobile-only meta. The desktop <aside> below is `hidden lg:flex`, so
            it drops away under lg — where the grid is one column and a sticky
            sidebar can't exist anyway. This puts the same meta card up top,
            ahead of the reading column (context before the read, not after it).
            No TOC here: the case studies are short, so a jump-list earns nothing
            on mobile. `lg:hidden` removes this from grid flow at lg, so the
            desktop two-column layout is untouched. */}
        <div className="lg:hidden">
          <MetaCard project={project} />
        </div>

        <div className="min-w-0">
          {sections.map((section) => (
            <section
              key={section.key}
              id={section.key}
              className="scroll-reveal mb-10 scroll-mt-20"
            >
              <Kicker label={section.kicker} />
              <h2 className="text-ink mb-3.5 text-2xl font-semibold tracking-tight">
                {section.title}
              </h2>
              {/* Keyed by index: static list, and a prose prefix is no longer a
                  safe key now that paragraphs may open with link markup. */}
              {section.paragraphs.map((para, index) => (
                <p
                  key={index}
                  className="text-dim mb-4 text-[16.5px] leading-relaxed text-pretty"
                >
                  <LinkedText text={para} />
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

        {/* top-20 is clearance for the sticky nav; when the nav slides away the
            rail takes that space back, and gives it up when the nav returns —
            see `data-nav-hidden` in components/site-nav.tsx. It moves rather
            than hides: the TOC is a scroll-spy, so it earns its place exactly
            while you're reading down the page.

            `top`, not a transform, and the difference is the whole trick: top
            does nothing on a sticky element until it actually sticks. A
            transform moved the rail the moment the nav went, while it was still
            in flow under the hero — so it jumped up into space it didn't own,
            before it had a nav to clear. This waits for the section above.

            Gated on motion-safe rather than undone by a motion-reduce override:
            `in-data-*` compiles after `motion-reduce` and would win the cascade.
            The nav itself doesn't move under reduced motion, so the rail has
            nothing to follow and stays put. */}
        <aside
          className={cn(
            "hidden flex-col gap-3.5 lg:sticky lg:top-20 lg:flex",
            "transition-[top] duration-[380ms] ease-out motion-reduce:transition-none",
            "in-data-nav-hidden:duration-300 in-data-nav-hidden:motion-safe:lg:top-6",
          )}
        >
          <MetaCard project={project} />
          {sections.length > 1 && <Toc sections={sections} />}
        </aside>
      </div>
    </>
  );
}
