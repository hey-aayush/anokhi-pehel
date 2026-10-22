import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "./Footer";

describe("Dashboard Footer Component", () => {
  it("renders copyright notice correctly", () => {
    render(<Footer />);
    expect(
      screen.getByText(/All rights reserved by anokhi-pehel/i)
    ).toBeInTheDocument();
  });

  it("renders maintenance disclaimer", () => {
    render(<Footer />);
    expect(
      screen.getByText(/The website is currently under maintenance/i)
    ).toBeInTheDocument();
  });
});
