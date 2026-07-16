// Single source of truth for the production origin. `metadataBase`, `robots`, and
// `sitemap` all derive from this, so moving to a different domain is a one-line
// edit here. No trailing slash — callers append their own paths.
export const SITE_URL = "https://arkadiusz.tech";

// The name a share card carries. Tab titles read as the route ("akds : about"),
// which is no use to someone seeing a link in a feed — so pages state this on
// their own `openGraph.title` rather than letting og:title inherit the terse
// one. Kept here so the two can't drift.
export const SITE_TITLE = "Arkadiusz Ostrowski — Software Engineer";
