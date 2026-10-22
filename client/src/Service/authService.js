import { apiGet, apiPost } from "./apiClient";

export const authService = {
  login: async (credentials) => {
    const res = await apiPost("/login", credentials);
    return res.data;
  },

  forgotPassword: async (email) => {
    const res = await apiPost("/forgot-password", { email });
    return res.data;
  },

  resetPassword: async (token, newPassword) => {
    const res = await apiPost(`/reset-password/${token}`, { newPassword });
    return res.data;
  },

  changePassword: async (passwords) => {
    const res = await apiPost("/changePassword", passwords);
    return res.data;
  },

  getUserData: async () => {
    const res = await apiPost("/getUserData");
    return res.data;
  },

  getSettings: async () => {
    const res = await apiGet("/settings");
    return res.data;
  },
};
