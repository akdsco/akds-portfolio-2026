import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LinkedText } from "./linked-text";

describe("LinkedText", () => {
  it("leaves text with no markup alone", () => {
    render(<LinkedText text="Built a thing that worked." />);

    expect(screen.getByText("Built a thing that worked.")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders [text](url) as a link, keeping the surrounding prose", () => {
    const { container } = render(
      <LinkedText text="Built [SlateIQ](https://slateiq.com/): a predictor." />,
    );

    const link = screen.getByRole("link", { name: "SlateIQ" });
    expect(link).toHaveAttribute("href", "https://slateiq.com/");
    expect(container).toHaveTextContent("Built SlateIQ: a predictor.");
  });

  // External links must not hand the opened page a live window.opener handle.
  it("opens in a new tab without leaking the opener", () => {
    render(<LinkedText text="[SlateIQ](https://slateiq.com/)" />);

    const link = screen.getByRole("link", { name: "SlateIQ" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("handles several links in one string", () => {
    render(
      <LinkedText text="[one](https://a.example) and [two](https://b.example) done" />,
    );

    expect(screen.getByRole("link", { name: "one" })).toHaveAttribute(
      "href",
      "https://a.example",
    );
    expect(screen.getByRole("link", { name: "two" })).toHaveAttribute(
      "href",
      "https://b.example",
    );
  });

  // The copy is owner-authored, so this isn't a live XSS vector — but the
  // renderer should be safe by construction rather than by trust. Only https is
  // linkified; anything else stays inert literal text.
  it.each([
    "[x](javascript:alert(1))",
    "[x](http://insecure.example)",
    "[x](data:text/html;base64,PHNjcmlwdD4=)",
    "[x](/relative/path)",
  ])("refuses to linkify %s", (text) => {
    render(<LinkedText text={text} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("leaves unmatched brackets as plain text", () => {
    render(<LinkedText text="an [unclosed link and (parens) here" />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(
      screen.getByText("an [unclosed link and (parens) here"),
    ).toBeInTheDocument();
  });
});
