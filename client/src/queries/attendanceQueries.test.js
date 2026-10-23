import { afterEach, describe, expect, it } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { attendanceKeys, invalidateAttendanceForSuccessfulWrite } from "./attendanceQueries";

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

describe("attendance table cache", () => {
  it("invalidates cached months after an attendance write", () => {
    const client = makeClient();
    const october = attendanceKeys.month("1", "2026-10");
    const september = attendanceKeys.month("1", "2026-09");
    client.setQueryData(october, { students: [] });
    client.setQueryData(september, { students: [] });
    invalidateAttendanceForSuccessfulWrite(client, { method: "post", url: "/submitAttendance" });
    expect(client.getQueryState(october).isInvalidated).toBe(true);
    expect(client.getQueryState(september).isInvalidated).toBe(true);
  });

  it("cannot restore a pre-write attendance response after cancellation", async () => {
    const client = makeClient();
    const key = attendanceKeys.month("1", "2026-10");
    let finishOld;
    const old = client.fetchQuery({
      queryKey: key,
      queryFn: ({ signal }) => {
        expect(signal).toBeDefined();
        return new Promise((resolve) => { finishOld = resolve; });
      },
    });
    invalidateAttendanceForSuccessfulWrite(client, { method: "post", url: "/submitAttendance" });
    finishOld({ students: [{ name: "old" }] });
    await old.catch(() => {});
    expect(client.getQueryData(key)).toBeUndefined();
  });
});
