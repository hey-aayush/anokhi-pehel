import { afterEach, describe, expect, it } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import {
  dashboardKeys,
  invalidateDashboardOverview,
  invalidateForSuccessfulWrite,
} from "./dashboardQueries";

const clients = [];
const makeClient = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  clients.push(client);
  return client;
};

afterEach(() => {
  clients.forEach((client) => client.clear());
  clients.length = 0;
});

describe("dashboard cache invalidation", () => {
  it.each([
    ["post", "/api/v1/user/submitAttendance"],
    ["post", "/api/v1/user/topicCovered"],
    ["post", "/api/v1/user/addStudent"],
    ["put", "/api/v1/user/updateStudent"],
    ["put", "/api/v1/user/promoteStudent/123"],
    ["put", "/api/v1/user/updateStudentStatus/123"],
    ["delete", "/api/v1/user/deleteStudents/123"],
  ])("invalidates every cached date after %s %s", (method, url) => {
    const client = makeClient();
    const today = dashboardKeys.date("2026-10-23");
    const yesterday = dashboardKeys.date("2026-10-22");
    client.setQueryData(today, { count: 1 });
    client.setQueryData(yesterday, { count: 1 });

    invalidateForSuccessfulWrite(client, { method, url });

    expect(client.getQueryState(today).isInvalidated).toBe(true);
    expect(client.getQueryState(yesterday).isInvalidated).toBe(true);
  });

  it("leaves cached dates fresh after unrelated requests", () => {
    const client = makeClient();
    const key = dashboardKeys.date("2026-10-23");
    client.setQueryData(key, { count: 1 });

    invalidateForSuccessfulWrite(client, { method: "get", url: "/api/v1/user/topicCovered" });
    invalidateForSuccessfulWrite(client, { method: "post", url: "/api/v1/user/getStudentByUserId" });

    expect(client.getQueryState(key).isInvalidated).toBe(false);
  });

  it("does not let a pre-write request restore stale data after invalidation", async () => {
    const client = makeClient();
    const key = dashboardKeys.date("2026-10-23");
    let finishOldRequest;
    const oldRequest = client.fetchQuery({
      queryKey: key,
      queryFn: ({ signal }) => {
        // Consuming signal lets React Query cancel the underlying HTTP request.
        expect(signal).toBeDefined();
        return new Promise((resolve) => {
          finishOldRequest = resolve;
        });
      },
    });

    await invalidateDashboardOverview(client);
    finishOldRequest({ count: 1 });
    await oldRequest.catch(() => {});

    expect(client.getQueryData(key)).toBeUndefined();
    const fresh = await client.fetchQuery({ queryKey: key, queryFn: async () => ({ count: 2 }) });
    expect(fresh).toEqual({ count: 2 });
    expect(client.getQueryData(key)).toEqual({ count: 2 });
  });
});
