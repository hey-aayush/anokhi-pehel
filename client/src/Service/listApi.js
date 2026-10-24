import { apiGet } from "./apiClient";

const getList = async (path, params, signal) => {
  const response = await apiGet(`/${path}`, params, { signal });
  return response.data;
};

export const getStudentPage = (params, signal) => getList("studentList", params, signal);
export const getParticipantPage = (params, signal) => getList("participantList", params, signal);
export const getAllStudents = (params) => getList("studentList", params);
export const getAllParticipants = (params) => getList("participantList", params);
export const getEvents = (signal) => getList("getEvents", undefined, signal);
