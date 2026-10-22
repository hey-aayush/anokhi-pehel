import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "./Footer";

describe("Home Footer Component", () => {
  it("renders mission text and copyright notice", () => {
    render(<Footer />);

    expect(
      screen.getByText(/Quality education and equal opportunities/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Copyright Ⓒ 2025 anokhipehel\.com/i)
    ).toBeInTheDocument();
  });

  it("renders logo image with alt text", () => {
    render(<Footer />);
    const logoImg = screen.getByAltText("KoOlScHoOl");
    expect(logoImg).toBeInTheDocument();
  });
});
