// Single source of truth for the production origin. `metadataBase`, `robots`, and
// `sitemap` all derive from this, so moving to a different domain is a one-line
// edit here. No trailing slash — callers append their own paths.
export const SITE_URL = "https://arkadiusz.tech";

// The site-wide social card, rendered by app/opengraph-image.tsx (which derives
// its own `size`/`alt` from this, so route and metadata can't drift). Next only
// injects the file-convention image at the segment owning the file, and a page
// that declares its own `openGraph` replaces the resolved one wholesale — so any
// such page must point at this explicitly or it ships with no og:image.
export const SOCIAL_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Arkadiusz Ostrowski — Software Engineer",
} as const;
