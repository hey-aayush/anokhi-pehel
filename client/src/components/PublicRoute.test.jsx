import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";

describe("PublicRoute Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders children when no token is present", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <div>Public Login Content</div>
              </PublicRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Public Login Content")).toBeInTheDocument();
  });

  it("redirects to home when token is present", () => {
    localStorage.setItem("token", "dummy-valid-token");

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <div>Public Login Content</div>
              </PublicRoute>
            }
          />
          <Route path="/" element={<div>Home Page Redirected</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText("Public Login Content")).not.toBeInTheDocument();
    expect(screen.getByText("Home Page Redirected")).toBeInTheDocument();
  });
});
