import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SuccessMessageModel from "./SuccessMessageModel";

describe("SuccessMessageModel Component", () => {
  it("renders success message correctly", () => {
    render(<SuccessMessageModel message="Operation completed successfully!" />);
    expect(
      screen.getByText("Operation completed successfully!")
    ).toBeInTheDocument();
  });

  it("calls onClose after specified timer duration", () => {
    vi.useFakeTimers();
    const handleClose = vi.fn();

    render(
      <SuccessMessageModel
        message="Saved!"
        timer={2000}
        onClose={handleClose}
      />
    );

    expect(handleClose).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(handleClose).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
