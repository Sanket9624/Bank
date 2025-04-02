import api from "./api";
import { handleApiCall } from "./apiHelper";

export const loginUser = async (data) =>
  handleApiCall(api.post("/users/login", data));

export const registerUser = async (data) =>
  handleApiCall(api.post("/users/register", data));

export const fetchUserDetails = async () => handleApiCall(api.get("/users/me"));

export const verifyOtp = async (data, flowType) =>
  handleApiCall(api.post(`/users/verify-otp?flowType=${flowType}`, data));

export const toggleTwoFactor = async (data) =>
  handleApiCall(api.post("/users/toggle-2fa", data));

export const fetchTwoFactorStatus = async () =>
  handleApiCall(api.get("/users/two-factor-status"));

export const forgotPassword = async (data) =>
  handleApiCall(api.post("/users/forgot-password", data));

export const resetPassword = async (data) =>
  handleApiCall(api.post("/users/reset-password", data));
