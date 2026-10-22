import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Spinner from "./Spinner";

describe("Spinner Component", () => {
  it("renders spinner waves correctly", () => {
    const { container } = render(<Spinner />);
    const waves = container.firstChild.querySelectorAll("div");
    expect(waves.length).toBe(10);
  });
});
