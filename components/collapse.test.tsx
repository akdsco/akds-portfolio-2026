import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { Collapse } from "@/components/collapse";

// The wrapper is the outer grid <div>; children render inside a nested min-h-0
// clip box. render() -> container.firstChild is that wrapper.
function renderCollapse(open: boolean) {
  const { container } = render(
    <Collapse open={open} id="panel">
      <p>hidden content</p>
    </Collapse>,
  );
  return container.firstChild as HTMLElement;
}

describe("Collapse", () => {
  test("is inert and zero-height when closed", () => {
    const wrapper = renderCollapse(false);
    // `inert` keeps clipped content out of tab order / assistive tech.
    expect(wrapper).toHaveAttribute("inert");
    expect(wrapper).toHaveClass("grid-rows-[0fr]");
    expect(wrapper).not.toHaveClass("grid-rows-[1fr]");
  });

  test("is interactive and full-height when open", () => {
    const wrapper = renderCollapse(true);
    expect(wrapper).not.toHaveAttribute("inert");
    expect(wrapper).toHaveClass("grid-rows-[1fr]");
    expect(wrapper).not.toHaveClass("grid-rows-[0fr]");
  });
});
