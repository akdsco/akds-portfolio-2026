import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { AboutMore } from "@/components/landing/about-more";

// scrollIntoView is a shared jsdom stub (vitest.setup.ts); reset its call log
// between cases so "was it called" assertions are independent.
beforeEach(() => vi.mocked(Element.prototype.scrollIntoView).mockClear());

function renderAboutMore() {
  return render(
    <AboutMore>
      <section id="skills">skills content</section>
    </AboutMore>,
  );
}

function fireReveal(id: string) {
  act(() => {
    window.dispatchEvent(new CustomEvent("about:reveal", { detail: id }));
  });
}

describe("AboutMore", () => {
  test("starts collapsed", () => {
    renderAboutMore();
    const toggle = screen.getByRole("button");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveTextContent("Show more");
  });

  test("reveals and scrolls when a managed section is targeted", async () => {
    renderAboutMore();
    fireReveal("skills");

    const toggle = screen.getByRole("button");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveTextContent("Show less");
    // scrollIntoView runs after a double rAF — wait for it.
    await waitFor(() =>
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled(),
    );
  });

  test("ignores an unmanaged section id", async () => {
    renderAboutMore();
    fireReveal("nope");

    const toggle = screen.getByRole("button");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    // Give any (unexpected) rAF-scheduled scroll a chance to fire.
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });
});
