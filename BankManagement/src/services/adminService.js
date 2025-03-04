import api from "./api";

export const createRole = async (roleName) => {
  const response = await api.post("/admin/roles", { roleName });
  return response.data;
};

export const getAllRoles = async () => {
  const response = await api.get("/admin/roles");
  return response.data;
};

export const deleteRole = async (roleId) => {
  const response = await api.delete(`/admin/roles/${roleId}`);
  return response.data;
};

// 🏦 Bank Manager Management
export const createUser = async (userData) => {
  const response = await api.post("/admin/bank-managers", userData);
  return response.data;
};

export const getAllBankManagers = async () => {
  const response = await api.get("/admin/bank-managers");
  return response.data;
};

// 👥 User Management
export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await api.put(`/admin/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};
