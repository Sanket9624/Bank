import api from "./api";
import { handleApiCall } from "./apiHelper";

export const fetchTransactionHistory = async () =>
  handleApiCall(api.get("/User/transactions"));

export const fetchCustomTransactionHistory = async (
  startDate,
  endDate,
  type,
  status,
) => {
  const params = {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(type && { type }),
    ...(status && { status }),
  };
  return handleApiCall(api.get("/User/customTransactions", { params }));
};

export const depositMoney = async (userId, amount, description = " ") =>
  handleApiCall(api.post("/User/deposit", { userId, amount, description }));

export const withdrawMoney = async (userId, amount, description = " ") =>
  handleApiCall(api.post("/User/withdraw", { userId, amount, description }));

export const transferMoney = async (
  receiverAccountNumber,
  amount,
  description = " ",
) =>
  handleApiCall(
    api.post("/User/transfer", { receiverAccountNumber, amount, description }),
  );
