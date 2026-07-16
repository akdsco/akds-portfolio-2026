// Single source of truth for the production origin. `metadataBase`, `robots`, and
// `sitemap` all derive from this, so moving to a different domain is a one-line
// edit here. No trailing slash — callers append their own paths.
export const SITE_URL = "https://arkadiusz.tech";

// The brand carries the site; the full name belongs on the page, not sprayed
// through every meta tag for anything that scrapes them. Tabs, cards and site
// name all lead with this.
export const SITE_BRAND = "akds";

/**
 * The openGraph fields every page has to restate.
 *
 * A page-level `openGraph` REPLACES the layout's rather than merging into it, so
 * anything omitted is simply absent from that page — miss `siteName` and the
 * card loses its attribution line, silently. Next's own docs prescribe exactly
 * this (generate-metadata, "Overwriting fields"): pull the shared fields out and
 * spread them. `type` and `title` stay per-page; they're what differs.
 */
export const OG_SHARED = {
  siteName: SITE_BRAND,
  locale: "en_GB",
} as const;
