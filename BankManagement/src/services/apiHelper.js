import api from "./api";

export const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall;
    return response.data;
  } catch (error) {
    console.error("API Error:", error?.message || "Unknown error");
    throw error;
  }
};
