import { apiGet, apiPost } from "./apiClient";

export const attendanceService = {
  getDashboardOverview: async (date) => {
    const res = await apiGet("/dashboardOverview", { date });
    return res.data;
  },

  submitAttendance: async (payload) => {
    const res = await apiPost("/submitAttendance", payload);
    return res.data;
  },

  getAttendance: async (classId, date) => {
    const res = await apiGet("/attendance", { classId, date });
    return res.data;
  },

  getAttendanceTotal: async () => {
    const res = await apiGet("/attendanceTotal");
    return res.data;
  },

  getMonthlyAttendance: async (classId, month) => {
    const res = await apiGet("/monthTotalAttendance", { classId, month });
    return res.data;
  },

  getTopicCovered: async (classId, date) => {
    const res = await apiGet("/topicCovered", { classId, date });
    return res.data;
  },
};
