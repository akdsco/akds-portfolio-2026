import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { AboutMore } from "@/components/landing/about-more";
import { scrollIntoViewLive } from "@/lib/scroll-into-view-live";

// The scroll itself is geometry, and jsdom has none — every rect is 0×0, so
// asserting where it lands here would only measure the mocks. Its behaviour is
// verified against a real browser instead; what's worth pinning down at this
// level is which section each entry point aims at.
vi.mock("@/lib/scroll-into-view-live", () => ({
  scrollIntoViewLive: vi.fn(() => vi.fn()),
}));

const TOGGLE_ID = "about-more-toggle";

beforeEach(() => vi.mocked(scrollIntoViewLive).mockClear());

// The id of the element we were asked to scroll to.
function scrolledTo() {
  return vi.mocked(scrollIntoViewLive).mock.calls.map(([el]) => el.id);
}

function renderAboutMore() {
  return render(
    <AboutMore>
      <section id="skills">skills content</section>
      <section id="experience">experience content</section>
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
    expect(document.getElementById("about-more")).toHaveAttribute("inert");
  });

  test("clicking the toggle opens the panel and scrolls to the first section", async () => {
    renderAboutMore();
    await userEvent.click(screen.getByRole("button", { name: /show more/i }));

    expect(document.getElementById("about-more")).not.toHaveAttribute("inert");
    expect(scrolledTo()).toEqual(["skills"]);
  });

  // The page decides the section order, so "first" has to be read off the DOM.
  // Hardcoding it here means a reorder in about/page.tsx silently aims the
  // toggle at the wrong section.
  test("follows the page's order rather than a hardcoded first section", async () => {
    render(
      <AboutMore>
        <section id="experience">experience content</section>
        <section id="skills">skills content</section>
      </AboutMore>,
    );
    await userEvent.click(screen.getByRole("button", { name: /show more/i }));

    expect(scrolledTo()).toEqual(["experience"]);
  });

  test("the toggle fades and collapses away for good once opened", async () => {
    renderAboutMore();
    const toggle = screen.getByRole("button", { name: /show more/i });
    await userEvent.click(toggle);

    // The row (toggle + its dashed rules) fades, and its own collapse takes the
    // space back on the same curve the panel expands on — no jump. `inert`
    // takes it out of reach immediately; it never returns as "Show less".
    expect(toggle.parentElement).toHaveClass("opacity-0");
    expect(document.getElementById(TOGGLE_ID)).toHaveAttribute("inert");
    expect(screen.queryByText(/show less/i)).toBeNull();
  });

  test("reveals and scrolls to the targeted section", () => {
    renderAboutMore();
    fireReveal("experience");

    expect(document.getElementById("about-more")).not.toHaveAttribute("inert");
    expect(scrolledTo()).toEqual(["experience"]);
  });

  test("a second jump while already open still scrolls", () => {
    renderAboutMore();
    fireReveal("experience");
    fireReveal("skills");

    expect(scrolledTo()).toEqual(["experience", "skills"]);
  });

  test("ignores an unmanaged section id", () => {
    renderAboutMore();
    fireReveal("nope");

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(scrollIntoViewLive).not.toHaveBeenCalled();
  });
});
