import { act, render, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { Collapse } from "@/components/collapse";

// The wrapper is the outer grid <div>; children render inside a nested min-h-0
// clip box. render() -> container.firstChild is that wrapper.
function renderCollapse(open: boolean) {
  const { container, rerender } = render(
    <Collapse open={open} id="panel">
      <p>hidden content</p>
    </Collapse>,
  );
  const wrapper = container.firstChild as HTMLElement;
  return {
    wrapper,
    clipBox: wrapper.firstChild as HTMLElement,
    setOpen: (next: boolean) =>
      rerender(
        <Collapse open={next} id="panel">
          <p>hidden content</p>
        </Collapse>,
      ),
    // The rows are given long enough to finish moving.
    settle: (el: HTMLElement, cls: string) =>
      waitFor(() => expect(el).toHaveClass(cls)),
  };
}

describe("Collapse", () => {
  test("is inert and zero-height when closed", () => {
    const { wrapper } = renderCollapse(false);
    // `inert` keeps clipped content out of tab order / assistive tech.
    expect(wrapper).toHaveAttribute("inert");
    expect(wrapper).toHaveClass("grid-rows-[0fr]");
    expect(wrapper).not.toHaveClass("grid-rows-[1fr]");
  });

  test("is interactive and full-height when open", () => {
    const { wrapper } = renderCollapse(true);
    expect(wrapper).not.toHaveAttribute("inert");
    expect(wrapper).toHaveClass("grid-rows-[1fr]");
    expect(wrapper).not.toHaveClass("grid-rows-[0fr]");
  });

  // The clip box is what hides the content while the rows animate. Once open it
  // has no job left, and it cuts off anything a child paints outside its own box
  // — card hover shadows were being sliced flat against it.
  test("clips while opening, then stops once the rows have settled", async () => {
    const { clipBox, settle } = renderCollapse(true);
    expect(clipBox).toHaveClass("overflow-hidden");

    await settle(clipBox, "overflow-visible");
    expect(clipBox).not.toHaveClass("overflow-hidden");
  });

  test("clips again as soon as it starts closing", async () => {
    const { clipBox, setOpen, settle } = renderCollapse(true);
    await settle(clipBox, "overflow-visible");

    // Must re-clip on the way down, or the content is visible as it shrinks.
    act(() => setOpen(false));
    expect(clipBox).toHaveClass("overflow-hidden");
  });

  test("re-clips for a second open after closing", async () => {
    const { clipBox, setOpen, settle } = renderCollapse(true);
    await settle(clipBox, "overflow-visible");
    act(() => setOpen(false));
    await settle(clipBox, "overflow-hidden");

    act(() => setOpen(true));
    expect(clipBox).toHaveClass("overflow-hidden");
  });
});
