import api from "./api";
import { handleApiCall } from "./apiHelper";

export const createRole = async (roleName) =>
  handleApiCall(api.post("/admin/roles", { roleName }));

export const getAllRoles = async () => handleApiCall(api.get("/admin/roles"));

export const deleteRole = async (roleId) =>
  handleApiCall(api.delete(`/admin/roles/${roleId}`));

export const createUser = async (userData) =>
  handleApiCall(api.post("/admin/managers", userData));

export const verifyOtp = async (data) =>
  handleApiCall(api.post("/admin/verify-otp", data));

export const getAllBankManagers = async () =>
  handleApiCall(api.get("/admin/managers"));

export const getAllUsers = async () => handleApiCall(api.get("/admin/users"));

export const getUsersWithStatus = async () =>
  handleApiCall(api.get("/admin/users-status"));

export const approveAccount = async (
  userId,
  isApproved,
  rejectedReason = " ",
) =>
  handleApiCall(
    api.post(`/admin/approve-account?rejectedReason=${rejectedReason}`, {
      userId,
      isApproved,
    }),
  );

export const updateUser = async (userId, userData) =>
  handleApiCall(api.put(`/admin/users/${userId}`, userData));

export const deleteUser = async (userId) =>
  handleApiCall(api.delete(`/admin/users/${userId}`));
