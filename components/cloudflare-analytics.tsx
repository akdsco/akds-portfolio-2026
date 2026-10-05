// Cloudflare Web Analytics — privacy-friendly, cookieless pageview counting that
// replaces the Vercel analytics that only reported on Vercel. The beacon token
// is public (it ships in the page), so it's a NEXT_PUBLIC_ build var set in the
// Cloudflare Pages project, not a secret. Read inside the function so Next
// inlines it at build and the component renders nothing until it's provided —
// no token, no dead beacon.
const BEACON_SRC = "https://static.cloudflareinsights.com/beacon.min.js";

export function CloudflareAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
  if (!token) return null;

  return (
    <script defer src={BEACON_SRC} data-cf-beacon={JSON.stringify({ token })} />
  );
}
