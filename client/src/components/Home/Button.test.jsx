import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "./Button";

describe("Button Component", () => {
  it("renders with default props and text", () => {
    render(<Button text="Click Me" />);
    const buttonElement = screen.getByRole("button", { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent("Click Me");
  });

  it("applies custom styles when provided", () => {
    render(<Button text="Styled Button" styles="mt-10 bg-blue-500" />);
    const buttonElement = screen.getByRole("button", { name: /styled button/i });
    expect(buttonElement).toHaveClass("mt-10");
    expect(buttonElement).toHaveClass("bg-blue-500");
  });

  it("triggers click handler function when clicked", () => {
    const handleClick = vi.fn();
    render(<Button text="Action" func={handleClick} />);
    const buttonElement = screen.getByRole("button", { name: /action/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
