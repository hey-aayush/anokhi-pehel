import { describe, it, expect } from "vitest";
import {
  getLocalDateString,
  formatDateDDMMYYYY,
  formatDisplayDate,
} from "./useDashboardData";

describe("useDashboardData date utility functions", () => {
  it("getLocalDateString formats a specific date to YYYY-MM-DD", () => {
    const fixedDate = new Date(2026, 9, 22); // Month is 0-indexed: 9 = October
    const result = getLocalDateString(fixedDate);
    expect(result).toBe("2026-10-22");
  });

  it("formatDateDDMMYYYY transforms YYYY-MM-DD to DD/MM/YYYY", () => {
    expect(formatDateDDMMYYYY("2026-10-22")).toBe("22/10/2026");
    expect(formatDateDDMMYYYY("2026-01-05")).toBe("05/01/2026");
    expect(formatDateDDMMYYYY("")).toBe("");
    expect(formatDateDDMMYYYY(null)).toBe("");
  });

  it("formatDisplayDate formats date for human-readable display", () => {
    expect(formatDisplayDate("2026-10-22")).toBe("22 Oct 2026");
    expect(formatDisplayDate("2026-01-05")).toBe("5 Jan 2026");
    expect(formatDisplayDate("")).toBe("");
  });
});
