import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "./Header";

describe("Dashboard Header Component", () => {
  it("renders category and title correctly", () => {
    render(<Header category="Dashboard" title="Analytics Overview" />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Analytics Overview")).toBeInTheDocument();
  });
});
