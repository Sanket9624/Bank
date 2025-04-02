import api from "./api";
import { handleApiCall } from "./apiHelper";

// Fetch bank summary
export const bankSummary = async () =>
  handleApiCall(api.get("/BankManager/summary"));

// Fetch user account details
export const getUserAccountDetails = async (userId) =>
  handleApiCall(api.get(`/BankManager/user-account/${userId}`));

// Fetch user account details By accountNumber
export const getUserAccountDetailsByAccountNumber = async (accountNumber) =>
  handleApiCall(api.get(`/BankManager/account/${accountNumber}`));

// Fetch all accounts
export const getAllAccounts = async () =>
  handleApiCall(api.get("/BankManager/total-accounts"));

// Fetch transactions with filters
export const getTransactions = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  return handleApiCall(api.get(`/BankManager/transactions?${params}`));
};

// Fetch pending transactions
export const getPendingTransactions = async () =>
  handleApiCall(api.get("/admin/pending-transactions"));

// Approve a transaction
export const approveTransaction = async (transactionId) =>
  handleApiCall(api.post(`/admin/approve/${transactionId}`));

// Reject a transaction with reason
export const rejectTransaction = async (transactionId, reason) =>
  handleApiCall(api.post(`/admin/reject/${transactionId}`, reason));
