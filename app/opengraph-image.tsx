import { ALT, CONTENT_TYPE, SIZE, renderOgCard } from "@/lib/og-card";

// Site-wide social card. app/twitter-image.tsx re-exports this; case studies get
// their own at app/projects/[slug]/opengraph-image.tsx with the project name as
// the caption.
export const size = SIZE;
export const contentType = CONTENT_TYPE;
export const alt = ALT;

export default function OpengraphImage() {
  return renderOgCard("AI Engineer · London");
}
