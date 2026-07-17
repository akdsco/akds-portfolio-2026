import { FooterWordmark } from "@/components/footer-wordmark";

export function SiteFooter() {
  return (
    // No top border: the ghosted wordmark below is the boundary. A rule *and* a
    // mark say "section ends here" twice, and the whole point of ghosting it was
    // to let it fade in rather than be announced. No top padding either — the
    // section above already ends in 56px of its own, and stacking a second gap
    // here just detached the mark from the page.
    <footer>
      {/* The wordmark is the whole footer now, so it is NOT aria-hidden: it's the
          only thing here, and it's the brand rather than ornament. A footer
          landmark containing nothing announceable would be a dead end. */}
      <div className="flex justify-center">
        {/* Ghosted to ~10% — texture, not a statement. It sits under the page
            rather than shouting, and works in both themes because --ink flips
            with them. Nudged right of centre so it reads as a placed mark
            instead of a heading — but only a little on mobile, where the mark
            nearly fills the width and the full nudge shoves the "s" off the
            edge. The font stops scaling below ~650px (clamp floor), so the
            offset has to give way there, not the desktop look. */}
        <FooterWordmark
          className="text-ink/10 translate-x-[9%] font-semibold select-none md:translate-x-[28%]"
          style={{ fontSize: "clamp(104px, 16vw, 208px)" }}
        />
      </div>
    </footer>
  );
}
