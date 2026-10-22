import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { useDashboardData } from "./useDashboardData";

afterEach(() => vi.restoreAllMocks());

describe("useDashboardData server state", () => {
  it("reuses a fresh overview when the dashboard remounts", async () => {
    const get = vi.spyOn(axios, "get").mockResolvedValue({
      data: {
        countsByClass: { "1": 25 },
        attendanceByClass: { "1": { total: 25, present: 20 } },
        topicsByClass: {},
      },
    });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 30_000 } } });
    const wrapper = ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );

    const first = renderHook(() => useDashboardData(), { wrapper });
    await waitFor(() => expect(first.result.current.loading).toBe(false));
    expect(first.result.current.classData.find((item) => item.id === "1").enrolled).toBe(25);
    first.unmount();

    const second = renderHook(() => useDashboardData(), { wrapper });
    expect(second.result.current.loading).toBe(false);
    expect(get).toHaveBeenCalledTimes(1);
    second.unmount();
    client.clear();
  });
});
