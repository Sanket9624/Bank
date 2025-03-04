import api from "./api";

export const fetchTransactionHistory = async () => {
  const response = await api.get("/User/transactions");
  return response.data;
};

export const fetchCustomTransactionHistory = async (startDate, endDate, type) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (type) params.type = type;

  const response = await api.get("/User/customTransactions", { params });
  return response.data;
};

export const depositMoney = async (userId, amount) => {
  const response = await api.post("/User/deposit", { userId, amount });
  return response.data;
};

export const withdrawMoney = async (userId, amount) => {
  const response = await api.post("/User/withdraw", { userId, amount });
  return response.data;
};

export const transferMoney = async (receiverAccountNumber, amount) => {
  const response = await api.post("/User/transfer", { receiverAccountNumber, amount });
  return response.data;
};
