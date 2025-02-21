import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchUserDetails } from "../../services/authService";
import {
  depositMoney,
  withdrawMoney,
  transferMoney,
  fetchTransactionHistory,
  fetchCustomTransactionHistory,
} from "../../services/userService";

const CustomerDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // Show banner message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // Fetch User & Account Details
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await fetchUserDetails(token);
        setUserData(user);
        const transactions = await fetchTransactionHistory(token);
        setTransactions(transactions);
        setFilteredTransactions(transactions);
      } catch (error) {
        showMessage("error", "Failed to fetch user or transaction data.");
      }
    };

    loadData();
  }, [token]);

  // Handle Deposit
  const handleDeposit = async () => {
    if (!amount || amount <= 0) {
      showMessage("error", "Please enter a valid amount.");
      return;
    }

    try {
      await depositMoney(userData?.userId, amount, token);
      showMessage("success", "Deposit Successful.");
      setAmount("");
      refreshData();
    } catch (error) {
      showMessage("error", "Deposit failed.");
    }
  };

  // Handle Withdraw
  const handleWithdraw = async () => {
    if (!amount || amount <= 0) {
      showMessage("error", "Please enter a valid amount.");
      return;
    }

    try {
      await withdrawMoney(userData?.userId, amount, token);
      showMessage("success", "Withdrawal Successful.");
      setAmount("");
      refreshData();
    } catch (error) {
      showMessage("error", "Withdrawal failed.");
    }
  };

  // Handle Transfer
  const handleTransfer = async () => {
    if (!receiverAccountNumber || !amount || amount <= 0) {
      showMessage("error", "Please enter a valid account number and amount.");
      return;
    }

    try {
      await transferMoney(receiverAccountNumber, amount, token);
      showMessage("success", "Money Transfer Successful.");
      setAmount("");
      setReceiverAccountNumber("");
      refreshData();
    } catch (error) {
      showMessage("error", "Transfer failed.");
    }
  };

  // Fetch Custom Transactions
  const handleFetchCustomTransactions = async () => {
    const today = new Date().toISOString().split("T")[0];

    if (!startDate || !endDate) {
      showMessage("error", "Please select both start and end dates.");
      return;
    }

    if (startDate > today || endDate > today) {
      showMessage("error", "Future dates are not allowed.");
      return;
    }

    if (startDate > endDate) {
      showMessage("error", "Start date cannot be after end date.");
      return;
    }

    try {
      const customTx = await fetchCustomTransactionHistory(startDate, endDate, token);
      setFilteredTransactions(customTx);
    } catch (error) {
      showMessage("error", "Failed to fetch custom transactions.");
    }
  };

  // Reset Filter
  const resetFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilteredTransactions(transactions);
  };

  // Refresh user and transaction data
  const refreshData = async () => {
    try {
      const updatedUser = await fetchUserDetails(token);
      setUserData(updatedUser);
      const updatedTransactions = await fetchTransactionHistory(token);
      setTransactions(updatedTransactions);
      setFilteredTransactions(updatedTransactions);
    } catch (error) {
      showMessage("error", "Failed to refresh data.");
    }
  };

  // Date Change Handlers
  const handleStartDateChange = (e) => {
    const today = new Date().toISOString().split("T")[0];
    const selectedDate = e.target.value;

    if (selectedDate > today) {
      setStartDate(today);
    } else {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (e) => {
    const today = new Date().toISOString().split("T")[0];
    const selectedDate = e.target.value;

    if (selectedDate > today) {
      showMessage("error", "Future dates are not allowed.");
      setEndDate(today);
    } else {
      setEndDate(selectedDate);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {message.text && (
        <div
          className={`p-2 mb-4 rounded ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Customer Dashboard</h2>

      {/* User Details */}
      {userData && (
        <div className="bg-white p-4 shadow rounded mb-4">
          <h3 className="text-lg font-semibold">User Details</h3>
          <p><strong>Full Name:</strong> {userData.fullName}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.roleName}</p>
        </div>
      )}

      {/* Account Details */}
      {userData?.account && (
        <div className="bg-white p-4 shadow rounded mb-4">
          <h3 className="text-lg font-semibold">Account Details</h3>
          <p><strong>Account Number:</strong> {userData.account.accountNumber}</p>
          <p><strong>Balance:</strong> ₹{userData.account.balance}</p>
          <p><strong>Account Type:</strong> {userData.account.accountType}</p>
        </div>
      )}

      {/* Manage Funds */}
      <div className="bg-white p-4 shadow rounded mb-4">
        <h3 className="text-lg font-semibold">Manage Funds</h3>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount"
          className="border p-2 w-full mb-2 rounded"
        />
        <button onClick={handleDeposit} className="bg-green-500 text-white p-2 w-full rounded mb-2">
          Deposit
        </button>
        <button onClick={handleWithdraw} className="bg-red-500 text-white p-2 w-full rounded mb-2">
          Withdraw
        </button>

        <input
          type="text"
          value={receiverAccountNumber}
          onChange={(e) => setReceiverAccountNumber(e.target.value)}
          placeholder="Enter Receiver Account Number"
          className="border p-2 w-full mb-2 rounded"
        />
        <button onClick={handleTransfer} className="bg-blue-500 text-white p-2 w-full rounded">
          Transfer Money
        </button>
      </div>

      {/* Custom Transaction Filter */}
      <div className="bg-white p-4 shadow rounded mb-4">
        <h3 className="text-lg font-semibold">Filter Transactions by Date</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleFetchCustomTransactions}
            className="bg-indigo-500 text-white p-2 rounded w-full"
          >
            Apply Filter
          </button>
          <button
            onClick={resetFilter}
            className="bg-gray-400 text-white p-2 rounded w-full"
          >
            Reset Filter
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        {filteredTransactions.length > 0 ? (
          <ul className="mt-2">
            {filteredTransactions.map((tx, index) => (
              <li key={index} className="border-b p-2">
                {tx.type} - ₹{tx.amount} on {tx.transactionDate}
                {tx.receiverName && ` (To: ${tx.receiverName})`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
