import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import AttendanceTable from "./AttendanceTable";

vi.mock("../../components/Dashboard/DashboardLayout", () => ({
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock("../../Modals/studentProfileModal", () => ({ default: () => null }));

afterEach(() => vi.restoreAllMocks());

describe("attendance table requests", () => {
  it("loads once for a complete selection and ignores an older class response", async () => {
    let finishFirst;
    const get = vi.spyOn(axios, "get").mockImplementation((_url, config) => {
      const classId = config.params.classId;
      if (classId === "1") {
        return new Promise((resolve) => { finishFirst = resolve; });
      }
      return Promise.resolve({ data: { students: [{ date: "2026-10-01", attendance: [{ studentId: "2", status: "present" }] }] } });
    });
    const post = vi.spyOn(axios, "post").mockResolvedValue({ data: [{ _id: "2", name: "New Student" }] });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={client}>
        <AttendanceTable />
      </QueryClientProvider>
    );
    fireEvent.change(screen.getByLabelText("Month"), { target: { value: "2026-10" } });
    expect(get).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText("Class"), { target: { value: "1" } });
    await waitFor(() => expect(get).toHaveBeenCalledTimes(1));
    fireEvent.change(screen.getByLabelText("Class"), { target: { value: "2" } });
    await waitFor(() => expect(screen.getByText("New Student")).toBeTruthy());
    finishFirst({ data: { students: [{ date: "2026-10-01", attendance: [{ studentId: "1", status: "absent" }] }] } });
    await waitFor(() => expect(get).toHaveBeenCalledTimes(2));
    expect(screen.getByText("New Student")).toBeTruthy();
    expect(post).toHaveBeenCalled();
    client.clear();
  });
});
