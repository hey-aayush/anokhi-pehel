import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import axios from "axios";
import store from "../redux/store";
import { setUser } from "../redux/features/userSlice";
import ProtectedRoute from "./ProtectedRoute";

vi.mock("axios");

describe("ProtectedRoute Component", () => {
  beforeEach(() => {
    localStorage.clear();
    store.dispatch(setUser(null));
    vi.clearAllMocks();
  });

  it("redirects to /login when no token exists in localStorage", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div data-testid="protected-content">Secret Dashboard</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={<div data-testid="login-page">Login Page</div>}
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  it("renders protected content and fetches active user successfully", async () => {
    localStorage.setItem("token", "dummy-jwt-token");
    axios.get = vi.fn().mockResolvedValueOnce({
      data: {
        success: true,
        data: { _id: "123", name: "Coordinator", isActive: true },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div data-testid="protected-content">Secret Dashboard</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  it("redirects to /login if user account is inactive", async () => {
    localStorage.setItem("token", "dummy-jwt-token");
    axios.get = vi.fn().mockResolvedValueOnce({
      data: {
        success: true,
        data: { _id: "123", name: "Inactive User", isActive: false },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div data-testid="protected-content">Secret Dashboard</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={<div data-testid="login-page">Login Page</div>}
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });
  });
});
