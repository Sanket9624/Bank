import axios from "axios";
import store from "../store";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7032/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor for Auth Token
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token && !config.url.includes("/users/register")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor for Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401 && !error.config.url.includes("/users/login")) {
        store.dispatch({ type: "auth/logout" });
        window.location.href = "/login";
      }
    }
    return Promise.reject(
      error?.response?.data || { message: "Something went wrong" },
    );
  },
);

export default api;
