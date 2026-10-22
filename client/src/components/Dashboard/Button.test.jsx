import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "./Button";

describe("Dashboard Button Component", () => {
  it("renders text and handles click event", () => {
    const handleClick = vi.fn();
    render(
      <Button
        text="Click Me"
        custumFunc={handleClick}
        bgColor="blue"
        color="white"
        size="md"
      />
    );

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders icon when provided", () => {
    render(
      <Button
        icon={<span data-testid="test-icon">Icon</span>}
        text="With Icon"
        custumFunc={() => {}}
      />
    );

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText(/With Icon/i)).toBeInTheDocument();
  });
});
