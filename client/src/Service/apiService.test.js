import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import {
  getErrorMessage,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
} from "./apiClient";
import { authService } from "./authService";
import { attendanceService } from "./attendanceService";
import { studentService } from "./studentService";
import { antyodayaService } from "./antyodayaService";

vi.mock("axios");

describe("API Client & Error Normalization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getErrorMessage", () => {
    it("returns default message when error is null or undefined", () => {
      expect(getErrorMessage(null)).toBe(
        "An unexpected error occurred. Please try again."
      );
      expect(getErrorMessage(undefined, "Custom fallback")).toBe(
        "Custom fallback"
      );
    });

    it("extracts error from response data string", () => {
      const err = { response: { data: "Invalid student credentials" } };
      expect(getErrorMessage(err)).toBe("Invalid student credentials");
    });

    it("extracts error from response data message field", () => {
      const err = {
        response: { data: { message: "Account is temporarily locked" } },
      };
      expect(getErrorMessage(err)).toBe("Account is temporarily locked");
    });

    it("extracts error from response data error field", () => {
      const err = {
        response: { data: { error: "Resource not found" } },
      };
      expect(getErrorMessage(err)).toBe("Resource not found");
    });

    it("normalizes Network Error to user-friendly text", () => {
      const err = { message: "Network Error: ECONNREFUSED" };
      expect(getErrorMessage(err)).toBe(
        "Network error. Please check your internet connection."
      );
    });

    it("falls back to error.message when available", () => {
      const err = new Error("Failed to parse JSON");
      expect(getErrorMessage(err)).toBe("Failed to parse JSON");
    });
  });

  describe("HTTP request wrappers", () => {
    it("apiGet calls axios.get with resolved URL and params", async () => {
      axios.get.mockResolvedValueOnce({ data: { success: true } });
      const res = await apiGet("/students", { class: "10" });
      expect(axios.get).toHaveBeenCalledTimes(1);
      const call = axios.get.mock.calls[0];
      expect(call[0]).toContain("/students");
      expect(call[1].params).toEqual({ class: "10" });
      expect(res.data.success).toBe(true);
    });

    it("apiPost calls axios.post with payload", async () => {
      axios.post.mockResolvedValueOnce({ data: { success: true } });
      const res = await apiPost("/login", { email: "test@example.com" });
      expect(axios.post).toHaveBeenCalledTimes(1);
      const call = axios.post.mock.calls[0];
      expect(call[0]).toContain("/login");
      expect(call[1]).toEqual({ email: "test@example.com" });
      expect(res.data.success).toBe(true);
    });

    it("apiPut calls axios.put with data", async () => {
      axios.put.mockResolvedValueOnce({ data: { updated: true } });
      const res = await apiPut("/updateStudent", { id: "123" });
      expect(axios.put).toHaveBeenCalledTimes(1);
      const call = axios.put.mock.calls[0];
      expect(call[0]).toContain("/updateStudent");
      expect(res.data.updated).toBe(true);
    });

    it("apiDelete calls axios.delete", async () => {
      axios.delete.mockResolvedValueOnce({ data: { deleted: true } });
      const res = await apiDelete("/deleteStudent/123");
      expect(axios.delete).toHaveBeenCalledTimes(1);
      const call = axios.delete.mock.calls[0];
      expect(call[0]).toContain("/deleteStudent/123");
      expect(res.data.deleted).toBe(true);
    });
  });

  describe("Domain Services", () => {
    it("authService calls login, forgotPassword, getUserData correctly", async () => {
      axios.post.mockResolvedValueOnce({ data: { success: true, authToken: "tok123" } });
      const loginData = await authService.login({ email: "user@test.com", password: "pwd" });
      expect(loginData.authToken).toBe("tok123");

      axios.post.mockResolvedValueOnce({ data: { message: "Email sent" } });
      const forgotData = await authService.forgotPassword("user@test.com");
      expect(forgotData.message).toBe("Email sent");

      axios.post.mockResolvedValueOnce({ data: { user: { role: "admin" } } });
      const userData = await authService.getUserData();
      expect(userData.user.role).toBe("admin");
    });

    it("attendanceService calls getDashboardOverview and submitAttendance", async () => {
      axios.get.mockResolvedValueOnce({ data: { countsByClass: { "1": 15 } } });
      const overview = await attendanceService.getDashboardOverview("2026-10-22");
      expect(overview.countsByClass["1"]).toBe(15);

      axios.post.mockResolvedValueOnce({ data: { success: true } });
      const subRes = await attendanceService.submitAttendance({ classId: "1" });
      expect(subRes.success).toBe(true);
    });

    it("studentService calls getStudentsByClass and deleteStudent", async () => {
      axios.get.mockResolvedValueOnce({ data: [{ name: "Student 1" }] });
      const students = await studentService.getStudentsByClass("10");
      expect(students.length).toBe(1);

      axios.delete.mockResolvedValueOnce({ data: { deleted: true } });
      const delRes = await studentService.deleteStudent("stud123");
      expect(delRes.deleted).toBe(true);
    });

    it("antyodayaService calls getEvents and getParticipantList with year filter", async () => {
      axios.get.mockResolvedValueOnce({ data: [{ eventName: "Dance" }] });
      const events = await antyodayaService.getEvents();
      expect(events[0].eventName).toBe("Dance");

      axios.get.mockResolvedValueOnce({ data: [{ studentName: "Participant 1" }] });
      const participants = await antyodayaService.getParticipantList(2026);
      expect(participants.length).toBe(1);
      const call = axios.get.mock.calls[1];
      expect(call[1].params).toEqual({ year: 2026 });
    });
  });
});
