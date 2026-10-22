import { describe, it, expect } from "vitest";
import axios from "axios";
import { SERVER_URL, BASE_URL } from "./helper";
import { queryClient } from "../queries/queryClient";
import { dashboardKeys } from "../queries/dashboardQueries";

describe("Service Helper Configuration", () => {
  it("exports valid SERVER_URL string", () => {
    expect(typeof SERVER_URL).toBe("string");
    expect(SERVER_URL.length).toBeGreaterThan(0);
  });

  it("exports valid BASE_URL ending with /api/v1/user", () => {
    expect(typeof BASE_URL).toBe("string");
    expect(BASE_URL).toContain("/api/v1/user");
  });

  it("invalidates dashboard data when a successful attendance write passes through Axios", async () => {
    const key = dashboardKeys.date("2026-10-23");
    queryClient.setQueryData(key, [{ enrolled: 1 }]);

    await axios.request({
      method: "post",
      url: `${BASE_URL}/submitAttendance`,
      data: {},
      adapter: async (config) => ({
        config,
        data: "Attendance submitted successfully",
        status: 200,
        statusText: "OK",
        headers: {},
      }),
    });

    expect(queryClient.getQueryState(key).isInvalidated).toBe(true);
    queryClient.clear();
  });
});
