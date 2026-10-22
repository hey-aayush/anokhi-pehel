import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ErrorMessageModel from "./ErrorMessageModel";

describe("ErrorMessageModel Component", () => {
  it("does not render when isOpen is false", () => {
    const { container } = render(
      <ErrorMessageModel
        isOpen={false}
        title="Error Occurred"
        message="Something went wrong"
        onClose={vi.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders error title and message when isOpen is true", () => {
    render(
      <ErrorMessageModel
        isOpen={true}
        title="Submission Failed"
        message="Network error encountered"
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText("Submission Failed")).toBeInTheDocument();
    expect(screen.getByText("Network error encountered")).toBeInTheDocument();
  });

  it("calls onClose when the Continue button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <ErrorMessageModel
        isOpen={true}
        title="Error"
        message="Check inputs"
        onClose={handleClose}
      />
    );
    const continueBtn = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(continueBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onRetry when Try Again button is clicked", () => {
    const handleRetry = vi.fn();
    render(
      <ErrorMessageModel
        isOpen={true}
        title="Failed"
        message="Please retry"
        onClose={vi.fn()}
        onRetry={handleRetry}
      />
    );
    const retryBtn = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
