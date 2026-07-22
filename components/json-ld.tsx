// Renders schema.org JSON-LD as a native <script>. Per Next 16's JSON-LD guide,
// JSON-LD is data, not executable JS, so `next/script` is deliberately not used.
// `JSON.stringify` doesn't sanitise, so `<` is escaped to its unicode form to
// stop any payload string (e.g. a stray "</script>") breaking out of the tag.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
