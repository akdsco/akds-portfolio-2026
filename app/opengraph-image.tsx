import { ALT, CONTENT_TYPE, SIZE, renderOgCard } from "@/lib/og-card";

// Site-wide social card. app/twitter-image.tsx re-exports this; case studies get
// their own at app/projects/[slug]/opengraph-image.tsx with the project name as
// the caption.
// `output: export` has no server to generate these on request, so the card is
// baked at build time. Without this, the static export aborts on this route.
export const dynamic = "force-static";
export const size = SIZE;
export const contentType = CONTENT_TYPE;
export const alt = ALT;

export default function OpengraphImage() {
  return renderOgCard("AI Engineer · London");
}
