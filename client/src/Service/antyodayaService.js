import { apiGet, apiPost, apiDelete } from "./apiClient";

export const antyodayaService = {
  getEvents: async () => {
    const res = await apiGet("/getEvents");
    return res.data;
  },

  getEventsWithWinners: async () => {
    const res = await apiGet("/getEventsWithWinners");
    return res.data;
  },

  getParticipantList: async (year) => {
    const params = year ? { year } : {};
    const res = await apiGet("/participantList", params);
    return res.data;
  },

  getPocList: async () => {
    const res = await apiGet("/pocList");
    return res.data;
  },

  addParticipant: async (formData) => {
    const res = await apiPost("/addParticipants", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  deleteParticipant: async (studentId) => {
    const res = await apiDelete(`/deleteParticipants/${studentId}`);
    return res.data;
  },
};
