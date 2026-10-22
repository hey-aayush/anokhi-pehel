import axios from "axios";

/**
 * Resolves the server base URL with Ostina-Freight architectural pattern:
 * - If VITE_SERVER_URL is explicitly set, use it.
 * - In local browser development (localhost / 127.0.0.1), use relative URLs
 *   so that the Vite development proxy forwards calls without CORS or cross-origin issues.
 * - In production/staging (e.g. Azure Web App), use the origin URL (forced to HTTPS).
 * - Fallback to Azure production domain for SSR or non-browser environments.
 */
function getBaseServerUrl() {
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_SERVER_URL
  ) {
    return import.meta.env.VITE_SERVER_URL.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.location) {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      // In development, empty base URL enables Vite reverse proxy
      return "";
    }
    const origin = window.location.origin;
    if (origin && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
      return origin.replace(/^http:/, "https:").replace(/\/+$/, "");
    }
    return origin.replace(/\/+$/, "");
  }

  return "https://anokhi-pehel.azurewebsites.net";
}

const resolvedServerUrl = getBaseServerUrl();

export const SERVER_URL =
  resolvedServerUrl || "https://anokhi-pehel.azurewebsites.net";

export const BASE_URL = resolvedServerUrl
  ? `${resolvedServerUrl}/api/v1/user`
  : "/api/v1/user";

/**
 * Global Axios Interceptor (Ostina-Freight standard):
 * - Automatically attaches 'Authorization: Bearer <token>' to all requests
 *   when an auth token exists in localStorage.
 * - Centralizes session revocation on HTTP 401 Unauthorized.
 */
axios.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRedirecting = false;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response &&
      error.response.status === 401 &&
      !isRedirecting
    ) {
      // Avoid looping if login endpoint itself returns 401
      const isLoginRequest = error.config && error.config.url && error.config.url.includes("/login");
      if (!isLoginRequest) {
        isRedirecting = true;
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);
