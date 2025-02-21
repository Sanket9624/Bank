import api from "./api";

export const loginUser = async (data) => {
  const response = await api.post("/users/login", data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post("/users/register", data);
  return response.data;
};

// 👤 User Endpoints
export const fetchUserDetails = async () => {
  const response = await api.get("/users/me");
  return response.data;
};