import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  message,
  Table,
  Switch,
  Spin,
  Row,
  Col,
  Tag,
} from "antd";
import {
  UserOutlined,
  CrownOutlined,
  BankOutlined,
  MailOutlined,
} from "@ant-design/icons";
import {
  fetchUserDetails,
  toggleTwoFactor,
  fetchTwoFactorStatus,
} from "../../services/authService";
import { bankSummary, getAllAccounts } from "../../services/bankManagerService";
import { fetchTransactionHistory } from "../../services/userService";
import { useSelector } from "react-redux";
import "antd/dist/reset.css";

const { Title, Text } = Typography;

const Dashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [totalAccounts, setTotalAccounts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [user, twoFactorStatus] = await Promise.all([
          fetchUserDetails(token),
          fetchTwoFactorStatus(),
        ]);
        setUserData(user);
        setTwoFactorEnabled(twoFactorStatus?.twoFactorEnabled || false);

        if (user.roleName === "BankManager" || user.roleName === "SuperAdmin") {
          const [summaryData, accountsData] = await Promise.all([
            bankSummary(),
            getAllAccounts(),
          ]);
          setSummary(summaryData);
          setTotalAccounts(accountsData?.totalAccounts ?? 0);
        }

        if (user.roleName === "Customer") {
          const transactions = await fetchTransactionHistory();
          setRecentTransactions(transactions.slice(0, 5));
        }
      } catch (error) {
        message.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [token]);

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "auto" }}>
      <Title
        level={2}
        style={{ textAlign: "left", fontWeight: "bold", marginBottom: "20px" }}
      >
        Dashboard
      </Title>
      {loading ? (
        <Spin
          size="large"
          style={{ display: "block", textAlign: "center", marginTop: 50 }}
        />
      ) : (
        <>
          <Card
            style={{
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "20px",
              background: "#f8f9fa",
            }}
          >
            <Title level={4} style={{ marginBottom: "20px" }}>
              Personal Information
            </Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card style={{ borderRadius: "10px", textAlign: "center" }}>
                  <UserOutlined
                    style={{ fontSize: "24px", color: "#1890ff" }}
                  />
                  <Title level={5}>Full Name</Title>
                  <Text strong>{userData?.fullName}</Text>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card style={{ borderRadius: "10px", textAlign: "center" }}>
                  <MailOutlined
                    style={{ fontSize: "24px", color: "#52c41a" }}
                  />
                  <Title level={5}>Email Address</Title>
                  <Text strong>{userData?.email}</Text>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card style={{ borderRadius: "10px", textAlign: "center" }}>
                  {userData?.roleName === "Customer" && (
                    <UserOutlined
                      style={{ fontSize: "24px", color: "#1890ff" }}
                    />
                  )}
                  {userData?.roleName === "BankManager" && (
                    <BankOutlined
                      style={{ fontSize: "24px", color: "green" }}
                    />
                  )}
                  {userData?.roleName === "SuperAdmin" && (
                    <CrownOutlined
                      style={{ fontSize: "24px", color: "gold" }}
                    />
                  )}
                  <Title level={5}>Role</Title>
                  <Text strong>{userData?.roleName}</Text>
                </Card>
              </Col>
            </Row>
          </Card>

          {(userData?.roleName === "BankManager" ||
            userData?.roleName === "SuperAdmin") &&
            summary && (
              <Row gutter={[16, 16]} justify="center">
                {/* First Row - 4 Blocks */}
                <Col xs={24} sm={12} md={6}>
                  <Card
                    hoverable
                    style={{
                      textAlign: "center",
                      borderRadius: "10px",
                      background: "#f0f5ff",
                    }}
                  >
                    <Title level={4} style={{ color: "#0050b3" }}>
                      {totalAccounts}
                    </Title>
                    <Text strong>Total Accounts</Text>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card
                    hoverable
                    style={{
                      textAlign: "center",
                      borderRadius: "10px",
                      background: "#f9f0ff",
                    }}
                  >
                    <Title level={4} style={{ color: "#531dab" }}>
                      {summary?.totalTransactions}
                    </Title>
                    <Text strong>Total Transactions</Text>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card
                    hoverable
                    style={{
                      textAlign: "center",
                      borderRadius: "10px",
                      background: "#f6ffed",
                    }}
                  >
                    <Title level={4} style={{ color: "green" }}>
                      ₹{summary?.totalBankBalance?.toFixed(2) ?? "N/A"}
                    </Title>
                    <Text strong>Total Balance</Text>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card
                    hoverable
                    style={{
                      textAlign: "center",
                      borderRadius: "10px",
                      background: "#e6fffb",
                    }}
                  >
                    <Title level={4} style={{ color: "green" }}>
                      ₹{summary?.totalDepositedMoney?.toFixed(2) ?? "N/A"}
                    </Title>
                    <Text strong>Total Deposits</Text>
                  </Card>
                </Col>

                {/* Second Row - Withdraw Block Centered */}
                <Col xs={24} sm={12} md={6} style={{ marginTop: "10px" }}>
                  <Card
                    hoverable
                    style={{
                      textAlign: "center",
                      borderRadius: "10px",
                      background: "#fff1f0",
                    }}
                  >
                    <Title level={4} style={{ color: "red" }}>
                      ₹{summary?.totalWithdrawnMoney?.toFixed(2) ?? "N/A"}
                    </Title>
                    <Text strong>Total Withdrawals</Text>
                  </Card>
                </Col>
              </Row>
            )}

          {userData?.roleName === "Customer" && userData?.account && (
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card style={{ textAlign: "center", borderRadius: "10px" }}>
                  <Text strong>Account Number</Text>
                  <Title level={4}>{userData.account.accountNumber}</Title>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card style={{ textAlign: "center", borderRadius: "10px" }}>
                  <Text strong>Balance</Text>
                  <Title level={3} style={{ color: "green" }}>
                    ₹{userData.account.balance.toFixed(2)}
                  </Title>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card style={{ textAlign: "center", borderRadius: "10px" }}>
                  <Text strong>Account Type</Text>
                  <Title level={4}>{userData.account.accountType}</Title>
                </Card>
              </Col>
            </Row>
          )}

          {userData?.roleName === "Customer" &&
            recentTransactions.length > 0 && (
              <Card
                title="Recent Transactions"
                style={{ marginTop: "20px", borderRadius: "10px" }}
              >
                <Table
                  columns={[
                    {
                      title: "Type",
                      dataIndex: "type",
                      key: "type",
                      render: (text) => {
                        let color =
                          text === "Deposit"
                            ? "green"
                            : text === "Withdraw"
                              ? "red"
                              : "blue";
                        return (
                          <Tag
                            color={color}
                            style={{ fontWeight: "bold", fontSize: "14px" }}
                          >
                            {text}
                          </Tag>
                        );
                      },
                    },
                    {
                      title: "Amount (₹)",
                      dataIndex: "amount",
                      key: "amount",
                      render: (amount, record) => {
                        let color =
                          record.type === "Deposit"
                            ? "green"
                            : record.type === "Withdraw"
                              ? "red"
                              : "blue";
                        return (
                          <span style={{ color, fontWeight: "bold" }}>
                            ₹{amount.toFixed(2)}
                          </span>
                        );
                      },
                    },
                    {
                      title: "Date",
                      dataIndex: "transactionDate",
                      key: "transactionDate",
                      render: (date) => (
                        <span style={{ fontSize: "13px", color: "#555" }}>
                          {new Date(date).toLocaleDateString()}
                        </span>
                      ),
                    },
                  ]}
                  dataSource={recentTransactions.map((data, index) => ({
                    ...data,
                    key: index,
                  }))}
                  pagination={{ pageSize: 5 }}
                  bordered
                  style={{ borderRadius: "10px" }}
                />
              </Card>
            )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
