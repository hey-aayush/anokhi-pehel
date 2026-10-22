import axios from "axios";
import { BASE_URL } from "./helper";

/**
 * Normalizes error messages from API response, network errors, or custom errors.
 *
 * @param {unknown} error - The caught error object
 * @param {string} [defaultMessage="An unexpected error occurred. Please try again."]
 * @returns {string} Human-readable error message
 */
export const getErrorMessage = (
  error,
  defaultMessage = "An unexpected error occurred. Please try again."
) => {
  if (!error) return defaultMessage;

  // Axios response errors
  if (error.response?.data) {
    const data = error.response.data;
    if (typeof data === "string" && data.trim().length > 0) {
      return data;
    }
    if (typeof data.message === "string" && data.message.trim().length > 0) {
      return data.message;
    }
    if (typeof data.error === "string" && data.error.trim().length > 0) {
      return data.error;
    }
  }

  // Network / client errors
  if (typeof error.message === "string" && error.message.trim().length > 0) {
    if (error.message.includes("Network Error")) {
      return "Network error. Please check your internet connection.";
    }
    return error.message;
  }

  return defaultMessage;
};

/**
 * Standard GET request wrapper
 */
export const apiGet = async (endpoint, params = {}, config = {}) => {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  return axios.get(url, { ...config, params });
};

/**
 * Standard POST request wrapper
 */
export const apiPost = async (endpoint, data = {}, config = {}) => {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  return axios.post(url, data, config);
};

/**
 * Standard PUT request wrapper
 */
export const apiPut = async (endpoint, data = {}, config = {}) => {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  return axios.put(url, data, config);
};

/**
 * Standard DELETE request wrapper
 */
export const apiDelete = async (endpoint, config = {}) => {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  return axios.delete(url, config);
};
