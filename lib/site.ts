// Single source of truth for the production origin. `metadataBase`, `robots`, and
// `sitemap` all derive from this, so moving to a different domain is a one-line
// edit here. No trailing slash — callers append their own paths.
export const SITE_URL = "https://arkadiusz.tech";
