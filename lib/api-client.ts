import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 15000
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error);
    }
    return Promise.reject(
      new Error("Network error, please check your connection and retry.")
    );
  }
);

