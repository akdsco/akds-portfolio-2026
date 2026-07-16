import { projects } from "@/data/portfolio";
import { ALT, CONTENT_TYPE, SIZE, renderOgCard } from "@/lib/og-card";

// Per-case-study card: same wordmark, project name as the caption. Living at
// this segment also means Next injects it automatically — the file-convention
// image only applies to the segment that owns the file, which is exactly why
// case studies used to ship with no og:image at all.
export const size = SIZE;
export const contentType = CONTENT_TYPE;
export const alt = ALT;

const caseStudies = projects.filter((p) => p.caseStudy);

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = caseStudies.find((p) => p.slug === slug);
  return renderOgCard(project?.title ?? "Software Engineer · London");
}
