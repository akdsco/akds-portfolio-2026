import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { AboutMore } from "@/components/landing/about-more";

// scrollIntoView is a shared jsdom stub (vitest.setup.ts); reset its call log
// between cases so "was it called" assertions are independent.
beforeEach(() => vi.mocked(Element.prototype.scrollIntoView).mockClear());

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

// Which element did we scroll to? The stub is on the prototype, so `this` is
// the target.
function scrolledIds() {
  return vi
    .mocked(Element.prototype.scrollIntoView)
    .mock.contexts.map((el) => (el as Element).id);
}

describe("AboutMore", () => {
  test("starts collapsed", () => {
    renderAboutMore();
    const toggle = screen.getByRole("button");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveTextContent("Show more");
  });

  test("clicking the toggle opens the panel and scrolls to the first section", async () => {
    renderAboutMore();
    await userEvent.click(screen.getByRole("button", { name: /show more/i }));

    expect(document.getElementById("about-more")).not.toHaveAttribute("inert");
    await waitFor(() => expect(scrolledIds()).toEqual(["skills"]));
  });

  test("the toggle fades out and leaves for good once opened", async () => {
    renderAboutMore();
    const toggle = screen.getByRole("button", { name: /show more/i });
    await userEvent.click(toggle);

    // The row (toggle + its dashed rules) fades first, still occupying layout,
    // then unmounts — it never comes back as a "Show less" affordance.
    expect(toggle.parentElement).toHaveClass("opacity-0");
    await waitFor(() => expect(screen.queryByRole("button")).toBeNull());
    expect(screen.queryByText(/show less/i)).toBeNull();
  });

  test("reveals and scrolls to the targeted section", async () => {
    renderAboutMore();
    fireReveal("experience");

    expect(document.getElementById("about-more")).not.toHaveAttribute("inert");
    await waitFor(() => expect(scrolledIds()).toEqual(["experience"]));
  });

  test("ignores an unmanaged section id", async () => {
    renderAboutMore();
    fireReveal("nope");

    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    // Give any (unexpected) scheduled scroll a chance to fire.
    await new Promise((r) => setTimeout(r, 400));
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });
});
