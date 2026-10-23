import { afterEach, describe, expect, it } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { invalidateList, invalidateListsForSuccessfulWrite, listKeys } from "./listQueries";

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

describe("list cache invalidation", () => {
  it.each([
    ["post", "/addStudent", listKeys.students],
    ["put", "/updateStudent", listKeys.students],
    ["delete", "/deleteStudents/1", listKeys.students],
    ["put", "/promoteStudent/1", listKeys.students],
    ["put", "/updateStudentStatus/1", listKeys.students],
    ["post", "/addParticipants", listKeys.participants],
    ["delete", "/deleteParticipants/1", listKeys.participants],
    ["post", "/addEvent", listKeys.events],
    ["post", "/editEvent", listKeys.events],
    ["delete", "/deleteEvent", listKeys.events],
  ])("invalidates %s %s", (method, url, key) => {
    const client = makeClient();
    const first = [...key, { page: 1 }];
    const second = [...key, { page: 2 }];
    client.setQueryData(first, { items: [] });
    client.setQueryData(second, { items: [] });
    invalidateListsForSuccessfulWrite(client, { method, url });
    expect(client.getQueryState(first).isInvalidated).toBe(true);
    expect(client.getQueryState(second).isInvalidated).toBe(true);
  });

  it("does not invalidate lists for read-like POSTs", () => {
    const client = makeClient();
    client.setQueryData(listKeys.students, []);
    invalidateListsForSuccessfulWrite(client, { method: "post", url: "/studentTable" });
    expect(client.getQueryState(listKeys.students).isInvalidated).toBe(false);
  });

  it("drops an in-flight pre-write page response", async () => {
    const client = makeClient();
    const key = listKeys.studentPage({ page: 1, limit: 40 });
    let finishOld;
    const old = client.fetchQuery({
      queryKey: key,
      queryFn: ({ signal }) => {
        expect(signal).toBeDefined();
        return new Promise((resolve) => { finishOld = resolve; });
      },
    });
    await invalidateList(client, listKeys.students);
    finishOld({ items: [{ name: "old" }] });
    await old.catch(() => {});
    expect(client.getQueryData(key)).toBeUndefined();
  });
});
