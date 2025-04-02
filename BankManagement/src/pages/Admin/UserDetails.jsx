import React, { useState, useEffect } from "react";
import { Button, message, Select, Card, Tabs, Spin } from "antd";
import {
  getTransactions,
  getUserAccountDetails,
} from "../../services/bankManagerService";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";
import dayjs from "dayjs"; // For handling dates and timezone
import ReusableTable from "../../Components/Table";
import ReusableDatePicker from "../../Components/DatePicker";

const { Option } = Select;
const { TabPane } = Tabs;

const UserDetails = () => {
  const { token } = useSelector((state) => state.auth); // Access auth token from Redux store
  const { userId } = useParams(); // Get user ID from URL params

  const [transactions, setTransactions] = useState([]); // State for transactions data
  const [loading, setLoading] = useState(false); // Loading state for data fetching
  const [transactionType, setTransactionType] = useState("All"); // Filter for transaction type
  const [status, setStatus] = useState("All"); // Filter for transaction status
  const [startDate, setStartDate] = useState(null); // Filter for start date
  const [endDate, setEndDate] = useState(null); // Filter for end date
  const [userDetails, setUserDetails] = useState({}); // State for user details

  // Fetch user details and transactions on initial load or when userId/token change
  useEffect(() => {
    if (userId && token) {
      fetchUserDetails(userId); // Fetch user details from the server
      fetchTransactions(userId); // Fetch transactions associated with this user
    }
  }, [userId, token]);

  // Fetch transactions whenever filters change
  useEffect(() => {
    if (userId) {
      fetchTransactions(userId);
    }
  }, [transactionType, status, startDate, endDate, userId]);

  // Fetch user account details from API
  const fetchUserDetails = async (userId) => {
    try {
      const data = await getUserAccountDetails(userId, token);
      if (data) {
        setUserDetails(data); // Set user details if data is successfully fetched
      } else {
        message.error("No user details found");
      }
    } catch (error) {
      message.error("Failed to fetch user details");
    }
  };

  // Fetch transactions based on filters
  const fetchTransactions = async (userId) => {
    try {
      setLoading(true); // Set loading state while fetching data
      const filters = { userId };

      // Apply filters dynamically if they are not set to 'All'
      if (transactionType !== "All") filters.transactionType = transactionType;
      if (status !== "All") filters.status = status;
      if (startDate)
        filters.startDate = dayjs(startDate)
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss[Z]");
      if (endDate)
        filters.endDate = dayjs(endDate)
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss[Z]");

      const data = await getTransactions(filters); // Fetch filtered transactions
      setTransactions(data); // Update state with fetched transactions
    } catch (error) {
      message.error("Failed to fetch transactions. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after data is fetched
    }
  };

  // Reset filters to their default values
  const resetFilters = () => {
    setTransactionType("All");
    setStatus("All");
    setStartDate(null);
    setEndDate(null);
  };

  // Transaction columns configuration for the table
  const transactionColumns = [
    {
      title: "Sender Name",
      dataIndex: "senderName",
      key: "senderName",
      sorter: (a, b) => a.senderName.localeCompare(b.senderName), // Sort by sender name
    },
    {
      title: "Receiver Name",
      dataIndex: "receiverName",
      key: "receiverName",
      sorter: (a, b) => a.receiverName.localeCompare(b.receiverName), // Sort by receiver name
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount, // Sort by transaction amount
      render: (amount, record) => (
        <span
          style={{
            color:
              record.type === "Deposit"
                ? "green"
                : record.type === "Withdraw"
                  ? "red"
                  : "blue",
          }}
        >
          {`$${amount}`} {/* Format the amount based on transaction type */}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Deposit", value: "Deposit" },
        { text: "Withdraw", value: "Withdraw" },
        { text: "Transfer", value: "Transfer" },
      ],
      onFilter: (value, record) => record.type === value, // Filter by transaction type
    },
    {
      title: "Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      sorter: (a, b) =>
        new Date(a.transactionDate) - new Date(b.transactionDate), // Sort by transaction date
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Approved", value: "Approved" },
        { text: "Rejected", value: "Rejected" },
      ],
      onFilter: (value, record) => record.status === value, // Filter by transaction status
    },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (reason) => reason || "N/A", // Display 'N/A' if no reason is available
    },
  ];

  return (
    <Card title="User Details">
      <Tabs defaultActiveKey="1">
        {/* Account Details Tab */}
        <TabPane tab="Account Details" key="1">
          <p>
            <strong>Full Name:</strong> {userDetails.fullName}
          </p>
          <p>
            <strong>Email:</strong> {userDetails.email}
          </p>
          <p>
            <strong>Account Number:</strong> {userDetails.accountNumber}
          </p>
          <p>
            <strong>Account Type:</strong> {userDetails.accountType}
          </p>
          <p>
            <strong>Balance:</strong> ${userDetails.balance}
          </p>
        </TabPane>

        {/* Transaction History Tab */}
        <TabPane tab="Transaction History" key="2">
          {/* Filters for transactions */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <Select
              placeholder="Transaction Type"
              onChange={setTransactionType}
              value={transactionType}
              style={{ width: 200 }}
              allowClear
            >
              <Option value="All">All</Option>
              <Option value="Deposit">Deposit</Option>
              <Option value="Withdraw">Withdraw</Option>
              <Option value="Transfer">Transfer</Option>
            </Select>
            <Select
              placeholder="Status"
              onChange={setStatus}
              value={status}
              style={{ width: 200 }}
              allowClear
            >
              <Option value="All">All</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
            <ReusableDatePicker
              placeholder="Start Date"
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
                setEndDate(null); // Reset end date when start date changes
              }}
              disabledDate={(current) => current && current > dayjs()} // Disable future dates
            />
            <ReusableDatePicker
              placeholder="End Date"
              value={endDate}
              onChange={setEndDate}
              disabledDate={(current) =>
                current &&
                (current > dayjs() || (startDate && current < startDate))
              } // Disable invalid dates based on start date
              disabled={!startDate} // Disable if no start date is selected
            />
            <Button onClick={resetFilters}>Reset</Button> {/* Reset filters */}
          </div>

          {/* Display transaction history table */}
          <ReusableTable
            columns={transactionColumns}
            dataSource={transactions}
            loading={loading} // Show loading spinner while fetching data
            pagination={{ pageSize: 10 }}
            rowKey="transactionId"
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default UserDetails;
