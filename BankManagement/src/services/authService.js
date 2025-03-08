import api from "./api";

// Helper function to handle API calls
const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall;
    return response.data;
  } catch (error) {
    console.error("API Error:", error?.response?.data?.message || error.message);
    throw error?.response?.data || { message: "Something went wrong" };
  }
};

export const loginUser = async (data) => {
  return await handleApiCall(api.post("/users/login", data));
};

export const registerUser = async (data) => {
  return await handleApiCall(api.post("/users/register", data));
};

export const fetchUserDetails = async () => {
  return await handleApiCall(api.get("/users/me"));
};

export const verifyOtp = async (data, flowType) => {
  const response = await api.post(`/users/verify-otp?flowType=${flowType}`, data); // Pass flowType in the URL
  return response.data;
};

export const toggleTwoFactor = async (data) => {
  return await handleApiCall(api.put("/users/toggle-2fa", data));
};

export const fetchTwoFactorStatus = async () => {
  return await handleApiCall(api.get("/users/two-factor-status"));
};

export const forgotPassword = async (data) => {
  return await handleApiCall(api.post("/users/forgot-password", data));
};

export const resetPassword = async (data) => {
  return await handleApiCall(api.post("/users/reset-password", data));
};
