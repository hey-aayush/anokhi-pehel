import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { message } from "antd";
import store from "../../redux/store";
import Login from "./Login";
import { authService } from "../../Service/authService";

vi.mock("../../Service/authService", () => ({
  authService: {
    login: vi.fn(),
  },
}));

vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

describe("Login Component Flow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/Dashboard"
              element={<div data-testid="dashboard-page">Dashboard</div>}
            />
            <Route
              path="/forgotPassword"
              element={<div data-testid="forgot-password-page">Forgot Password</div>}
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  it("renders the login form elements correctly", () => {
    renderLogin();
    expect(screen.getByRole("heading", { name: /sign in to your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("toggles password visibility when eye toggle button is clicked", () => {
    renderLogin();
    const passwordInput = screen.getByPlaceholderText("••••••••");
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleBtn = passwordInput.parentElement.querySelector("button");
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("handles successful login, sets token in localStorage, and navigates to Dashboard", async () => {
    authService.login.mockResolvedValueOnce({
      success: true,
      authToken: "sample-valid-jwt-token",
    });

    renderLogin();
    const emailInput = screen.getByLabelText(/your email/i);
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitBtn = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "mentor@anokhipehel.com" } });
    fireEvent.change(passwordInput, { target: { value: "Secret123!" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: "mentor@anokhipehel.com",
        password: "Secret123!",
      });
      expect(localStorage.getItem("token")).toBe("sample-valid-jwt-token");
      expect(message.success).toHaveBeenCalledWith("Login successfully!!!");
      expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    });
  });

  it("displays error message on failed login response", async () => {
    authService.login.mockResolvedValueOnce({
      success: false,
      error: "Invalid email or password",
    });

    renderLogin();
    const emailInput = screen.getByLabelText(/your email/i);
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitBtn = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "wrong@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Invalid email or password");
    });
  });

  it("navigates to /forgotPassword when link is clicked", () => {
    renderLogin();
    const forgotLink = screen.getByText(/click here to reset/i);
    fireEvent.click(forgotLink);
    expect(screen.getByTestId("forgot-password-page")).toBeInTheDocument();
  });
});
