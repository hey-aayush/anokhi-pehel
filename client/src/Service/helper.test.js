import { describe, it, expect } from "vitest";
import { SERVER_URL, BASE_URL } from "./helper";

describe("Service Helper Configuration", () => {
  it("exports valid SERVER_URL string", () => {
    expect(typeof SERVER_URL).toBe("string");
    expect(SERVER_URL.length).toBeGreaterThan(0);
  });

  it("exports valid BASE_URL ending with /api/v1/user", () => {
    expect(typeof BASE_URL).toBe("string");
    expect(BASE_URL).toContain("/api/v1/user");
  });
});
