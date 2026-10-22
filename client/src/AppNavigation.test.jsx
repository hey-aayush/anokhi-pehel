import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";

describe("End-to-End Navigation & Route Protection Flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderRoutes = (initialEntry) =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            {/* Protected Route */}
            <Route
              path="/Dashboard"
              element={
                <ProtectedRoute>
                  <div data-testid="dashboard-page">Dashboard Page</div>
                </ProtectedRoute>
              }
            />

            {/* Public Auth Routes (Redirects authenticated user to /) */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <div data-testid="login-page">Login Page</div>
                </PublicRoute>
              }
            />
            <Route
              path="/forgotPassword"
              element={
                <PublicRoute>
                  <div data-testid="forgot-password-page">Forgot Password Page</div>
                </PublicRoute>
              }
            />

            {/* Public Informational Routes (Accessible to both Guest and Authenticated users) */}
            <Route path="/Join" element={<div data-testid="join-page">Join Us Page</div>} />
            <Route path="/blog" element={<div data-testid="blog-page">Blog Page</div>} />
            <Route path="/gallery" element={<div data-testid="gallery-page">Gallery Page</div>} />
            <Route path="/team" element={<div data-testid="team-page">Team Page</div>} />
            <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
            <Route path="/connectWithUs" element={<div data-testid="connect-page">Connect Page</div>} />
            <Route path="/backToSchool" element={<div data-testid="back-to-school-page">Back to School</div>} />
            <Route path="/Antyodaya" element={<div data-testid="antyodaya-page">Antyodaya Festival</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

  it("allows authenticated user to browse public pages without redirecting to /", () => {
    localStorage.setItem("token", "valid-jwt-token");

    const publicPaths = [
      { path: "/Join", testId: "join-page" },
      { path: "/blog", testId: "blog-page" },
      { path: "/gallery", testId: "gallery-page" },
      { path: "/team", testId: "team-page" },
      { path: "/connectWithUs", testId: "connect-page" },
      { path: "/backToSchool", testId: "back-to-school-page" },
      { path: "/Antyodaya", testId: "antyodaya-page" },
    ];

    for (const { path, testId } of publicPaths) {
      const { unmount } = renderRoutes(path);
      expect(screen.getByTestId(testId)).toBeInTheDocument();
      expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();
      unmount();
    }
  });

  it("redirects authenticated user to home when accessing login or forgotPassword", () => {
    localStorage.setItem("token", "valid-jwt-token");

    const { unmount: unmountLogin } = renderRoutes("/login");
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
    unmountLogin();

    const { unmount: unmountForgot } = renderRoutes("/forgotPassword");
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.queryByTestId("forgot-password-page")).not.toBeInTheDocument();
    unmountForgot();
  });

  it("redirects unauthenticated user to /login when attempting to access /Dashboard", () => {
    renderRoutes("/Dashboard");
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-page")).not.toBeInTheDocument();
  });

  it("allows unauthenticated user to access public pages", () => {
    const { unmount } = renderRoutes("/blog");
    expect(screen.getByTestId("blog-page")).toBeInTheDocument();
    unmount();
  });
});
