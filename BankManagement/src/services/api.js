import axios from "axios";
import store from "../store"; 

const api = axios.create({
  baseURL: "https://localhost:7032/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState(); 
    const token = state.auth.token; 

    // Add token if available and endpoint requires it
    if (token && !config.url.includes("/users/login") && !config.url.includes("/users/register")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
