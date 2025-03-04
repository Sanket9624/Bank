import React, { useEffect, useState } from "react";
import { Card, Typography, message, Alert, Table } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { fetchUserDetails } from "../../services/authService";
import { bankSummary } from "../../services/bankManagerService";
import { fetchTransactionHistory } from "../../services/userService";
import '@ant-design/v5-patch-for-react-19';
import { useSelector } from "react-redux";
import "antd/dist/reset.css"; // Ant Design reset styles

const { Title } = Typography;

const Dashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const user = await fetchUserDetails(token);
        setUserData(user);
        if (user.roleName === "BankManager" || user.roleName === "SuperAdmin") {
          fetchBankSummary();
        }
        if (user.roleName === "Customer") {
          fetchRecentTransactions();
        }
      } catch (error) {
        message.error("Failed to fetch user details.");
      }
    };

    const fetchBankSummary = async () => {
      try {
        const data = await bankSummary();
        setSummary(data);
      } catch (error) {
        message.error("Failed to fetch bank summary.");
      }
    };

    const fetchRecentTransactions = async () => {
      try {
        const data = await fetchTransactionHistory();
        setRecentTransactions(data.slice(0, 5));
      } catch (error) {
        message.error("Failed to fetch recent transactions.");
      }
    };

    loadUserDetails();
  }, [token]);

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Amount (₹)",
      dataIndex: "amount",
      key: "amount",
      responsive: ["xs", "sm", "md", "lg"],
      render: (amount, record) => (
        <strong style={{ color: record.type === "Deposit" ? "green" : "red" }}>₹{amount}</strong>
      ),
    },
    {
      title: "Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      responsive: ["xs", "sm", "md", "lg"],
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>Dashboard</Title>

      {userData ? (
        <Card title="User Information" style={{ marginBottom: "20px" }}>
          <Card.Grid style={{ width: "100%" }}>
            <p><strong>Full Name:</strong> {userData.fullName}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Role:</strong> {userData.roleName}</p>
          </Card.Grid>
        </Card>
      ) : (
        <Alert message="User not found" type="error" showIcon />
      )}

      {userData?.account && (
        <Card title="Account Details" style={{ marginBottom: "20px" }}>
          <Card.Grid style={{ width: "100%" }}>
            <p><strong>Account Number:</strong> {userData.account.accountNumber}</p>
            <p><strong>Balance:</strong> ₹{userData.account.balance}</p>
            <p><strong>Account Type:</strong> {userData.account.accountType}</p>
          </Card.Grid>
        </Card>
      )}

      {(userData?.roleName === "BankManager" || userData?.roleName === "SuperAdmin") && summary && (
        <Card title="Bank Summary" style={{ marginBottom: "20px" }}>
          <Card.Grid style={{ width: "100%" }}>
            <p><strong>Total Bank Balance:</strong> ₹{summary.totalBankBalance}</p>
            <p><strong>Total Deposits:</strong> ₹{summary.totalDepositedMoney}</p>
            <p><strong>Total Withdrawals:</strong> ₹{summary.totalWithdrawnMoney}</p>
            <p><strong>Total Transactions:</strong> {summary.totalTransactions}</p>
          </Card.Grid>
        </Card>
      )}

      {userData?.roleName === "Customer" && recentTransactions.length > 0 && (
        <Card title="Recent Transactions">
          <Table
            columns={columns}
            dataSource={recentTransactions.map((data, index) => ({ ...data, key: index }))}
            pagination={false}
            scroll={{ x: true }}
          />
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
