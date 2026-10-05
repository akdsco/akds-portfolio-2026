import { ALT, CONTENT_TYPE, SIZE, renderOgCard } from "@/lib/og-card";

// Card for the /projects index. Case studies override this with their own at
// app/projects/[slug]/opengraph-image.tsx; /about and / inherit the root card
// instead, since / redirects to /about — that link is the home page, so it keeps
// the role caption rather than reading "About".
// Baked at build time — `output: export` has no server to render it on request.
export const dynamic = "force-static";
export const size = SIZE;
export const contentType = CONTENT_TYPE;
export const alt = ALT;

export default function OpengraphImage() {
  return renderOgCard("Projects");
}
