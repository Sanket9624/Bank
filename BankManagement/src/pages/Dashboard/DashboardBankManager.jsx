  import React, { useState, useEffect } from 'react';
  import { 
      bankSummary, getTransactions, getUserAccountDetails
  } from '../../services/bankManagerService';
  import { getAllUsers } from '../../services/adminService';
  
  const DashboardBankManager = () => {
      const [summary, setSummary] = useState(null);
      const [transactionType, setTransactionType] = useState('');
      const [startDate, setStartDate] = useState('');
      const [endDate, setEndDate] = useState('');
      const [transactions, setTransactions] = useState([]);
      const [users, setUsers] = useState([]);
      const [userAccount, setUserAccount] = useState(null);
      const [selectedUserId, setSelectedUserId] = useState(null);
  
      useEffect(() => {
          fetchBankSummary();
          fetchAllUsers();
          fetchTransactions();  // Load all transactions by default
      }, []);
  
      const fetchBankSummary = async () => {
          try {
              const data = await bankSummary();
              setSummary(data);
          } catch (error) {
              console.error('Failed to fetch bank summary', error);
              alert('Failed to fetch bank summary. Please try again.');
          }
      };
  
      const fetchAllUsers = async () => {
          try {
              const data = await getAllUsers();
              setUsers(data);
          } catch (error) {
              console.error('Failed to fetch users', error);
              alert('Failed to fetch users. Please try again.');
          }
      };
  
      const fetchTransactions = async (userId = null) => {
          try {
              const filters = {};
              if (userId) filters.userId = userId;
              if (transactionType) filters.transactionType = transactionType;
              if (startDate) filters.startDate = startDate;
              if (endDate) filters.endDate = endDate;
      
              const data = await getTransactions(filters);
              setTransactions(data);
          } catch (error) {
              console.error('Failed to fetch transactions', error);
              alert('Failed to fetch transactions. Please try again.');
          }
      };
  
      const resetFilters = () => {
          setTransactionType('');
          setStartDate('');
          setEndDate('');
          setSelectedUserId(null);
          fetchTransactions(); // Fetch all transactions after resetting filters
      };
      
      const handleUserAccountDetails = async (email) => {
          try {
              const data = await getUserAccountDetails(email);
              setUserAccount(data);
          } catch (error) {
              console.error('Failed to fetch user account details', error);
              alert('Failed to fetch user account details. Please try again.');
          }
      };
  
      const handleUserTransactionHistory = (userId) => {
          setSelectedUserId(userId);
          fetchTransactions(userId);
      };
  
      return (
          <div className="container mx-auto p-4">
              <h1 className="text-2xl font-bold mb-4">Bank Manager Dashboard</h1>
  
              {summary && (
                  <div className="mb-4 p-4 border rounded bg-gray-100">
                      <h2 className="text-xl font-semibold">Bank Summary</h2>
                      <p>Bank Balance: {summary.totalBankBalance}</p>
                      <p>Total Deposits: {summary.totalDepositedMoney}</p>
                      <p>Total Withdrawals: {summary.totalWithdrawnMoney}</p>
                      <p>Total Transactions: {summary.totalTransactions}</p>
                  </div>
              )}
  
              {/* User List */}
              <div className="mb-4">
                  <h2 className="text-xl font-semibold">All Users</h2>
                  {users.length > 0 ? (
                      <table className="w-full border-collapse border border-gray-300 mt-2">
                          <thead>
                              <tr className="bg-gray-200">
                                  <th className="border p-2">User ID</th>
                                  <th className="border p-2">Full Name</th>
                                  <th className="border p-2">Email</th>
                                  <th className="border p-2">Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {users.map((user) => (
                                  <tr key={user.userId}>
                                      <td className="border p-2">{user.userId}</td>
                                      <td className="border p-2">{user.firstName} {user.lastName}</td>
                                      <td className="border p-2">{user.email}</td>
                                      <td className="border p-2">
                                          <button
                                              onClick={() => handleUserAccountDetails(user.email)}
                                              className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                          >
                                              See Account Details
                                          </button>
                                          <button
                                              onClick={() => handleUserTransactionHistory(user.userId)}
                                              className="bg-blue-500 text-white px-2 py-1 rounded"
                                          >
                                              See Transaction History
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  ) : (
                      <p>No users found.</p>
                  )}
              </div>
  
              {/* Filter Transactions */}
              <div className="mb-4">
                  <h2 className="text-xl font-semibold">Filter Transactions</h2>
                  <div className="flex gap-4">
                      <input
                          type="text"
                          placeholder="Transaction Type (Deposit/Withdraw)"
                          value={transactionType}
                          onChange={(e) => setTransactionType(e.target.value)}
                          className="border p-2"
                      />
                      <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="border p-2"
                      />
                      <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="border p-2"
                      />
                      <button 
                          onClick={() => fetchTransactions(selectedUserId)}
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                          Fetch Transactions
                      </button>
                      <button 
                          onClick={resetFilters} 
                          className="bg-gray-500 text-white px-4 py-2 rounded"
                      >
                          Reset Filters
                      </button>
                  </div>
              </div>
  
              {/* Transactions Table */}
              <div className="mt-4">
                  <h2 className="text-xl font-semibold">All Transactions</h2>
                  {transactions.length > 0 ? (
                      <table className="w-full border-collapse border border-gray-300 mt-2">
                          <thead>
                              <tr className="bg-gray-200">
                                  <th className="border p-2">Sender Name</th>
                                  <th className="border p-2">Receiver Name</th>
                                  <th className="border p-2">Amount</th>
                                  <th className="border p-2">Type</th>
                                  <th className="border p-2">Date</th>
                              </tr>
                          </thead>
                          <tbody>
                              {transactions.map((tx, index) => (
                                  <tr key={index}>
                                      <td className="border p-2">{tx.senderName || 'N/A'}</td>
                                      <td className="border p-2">{tx.receiverName || 'N/A'}</td>
                                      <td className="border p-2">{tx.amount}</td>
                                      <td className="border p-2">{tx.type}</td>
                                      <td className="border p-2">{new Date(tx.transactionDate).toLocaleString()}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  ) : (
                      <p>No transactions found.</p>
                  )}
              </div>
  
              {/* User Account Details */}
              {userAccount && (
                  <div className="mt-6 p-4 border rounded bg-gray-100">
                      <h2 className="text-xl font-semibold">User Account Details</h2>
                      <p><strong>Full Name:</strong> {userAccount.fullName}</p>
                      <p><strong>Email:</strong> {userAccount.email}</p>
                      <p><strong>Account Number:</strong> {userAccount.accountNumber}</p>
                      <p><strong>Account Type:</strong> {userAccount.accountType}</p>
                      <p><strong>Balance:</strong> {userAccount.balance}</p>
                  </div>
              )}
          </div>
      );
  };
  
  export default DashboardBankManager;
  