// Single source of truth for the production origin. `metadataBase`, `robots`, and
// `sitemap` all derive from this, so moving to a different domain is a one-line
// edit here. No trailing slash — callers append their own paths.
export const SITE_URL = "https://arkadiusz.tech";

// The brand carries the site; the full name belongs on the page, not sprayed
// through every meta tag for anything that scrapes them. Tabs, cards and site
// name all lead with this.
export const SITE_BRAND = "akds";
