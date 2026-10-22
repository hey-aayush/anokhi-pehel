import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import ForgotPassword from "./ForgotPassword";
import { authService } from "../../Service/authService";

vi.mock("../../Service/authService", () => ({
  authService: {
    forgotPassword: vi.fn(),
  },
}));

describe("ForgotPassword Component Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders forgot password form correctly", () => {
    render(<ForgotPassword />);
    expect(screen.getByRole("heading", { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/your email/i)).toBeInTheDocument();
    expect(screen.getByText(/^reset password$/i)).toBeInTheDocument();
  });

  it("submits email and displays success feedback message", async () => {
    authService.forgotPassword.mockResolvedValueOnce({
      message: "If the email is registered, password reset instructions have been sent.",
    });

    render(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/your email/i);
    const submitBtn = screen.getByText(/^reset password$/i);

    fireEvent.change(emailInput, { target: { value: "user@test.com" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authService.forgotPassword).toHaveBeenCalledWith("user@test.com");
      expect(
        screen.getByText(/password reset instructions have been sent/i)
      ).toBeInTheDocument();
    });
  });

  it("handles error during forgot password submission and displays feedback", async () => {
    authService.forgotPassword.mockRejectedValueOnce({
      response: {
        data: { message: "Too many requests, please try again later." },
      },
    });

    render(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/your email/i);
    const submitBtn = screen.getByText(/^reset password$/i);

    fireEvent.change(emailInput, { target: { value: "spam@test.com" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/too many requests, please try again later/i)
      ).toBeInTheDocument();
    });
  });
});
