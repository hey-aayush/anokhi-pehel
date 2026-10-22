import { apiGet, apiPost, apiDelete } from "./apiClient";

export const studentService = {
  getStudentsByClass: async (className) => {
    const res = await apiGet("/students", { class: className });
    return res.data;
  },

  getStudentById: async (studentId) => {
    const res = await apiGet("/getstudentByUserId", { studentid: studentId });
    return res.data;
  },

  getStudentCounts: async () => {
    const res = await apiGet("/studentCounts");
    return res.data;
  },

  promoteStudents: async (payload) => {
    const res = await apiPost("/promoteStudent", payload);
    return res.data;
  },

  updateStudentStatus: async (payload) => {
    const res = await apiPost("/updateStudentStatus", payload);
    return res.data;
  },

  deleteStudent: async (studentId) => {
    const res = await apiDelete(`/deleteStudents/${studentId}`);
    return res.data;
  },
};
