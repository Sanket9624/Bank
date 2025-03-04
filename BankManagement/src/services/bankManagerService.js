import api from "./api";

export const bankSummary = async () => {
  const response = await api.get("/BankManager/summary");
  return response.data;
};

export const getUserAccountDetails = async (userId) => {
    const response = await api.get(`BankManager/user-account/${userId}`);
    return response.data
}

export const getAllAccounts = async () => {
    const response = await api.get(`BankManager/total-accounts`);
    return response.data
}

export const getTransactions = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/BankManager/transactions?${params}`);
  return response.data;
};