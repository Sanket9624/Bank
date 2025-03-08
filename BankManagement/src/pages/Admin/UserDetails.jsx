import React, { useState, useEffect } from "react";
import { Button, Table, message, DatePicker, Select, Card, Tabs } from "antd";
import { getTransactions, getUserAccountDetails } from "../../services/bankManagerService";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import '@ant-design/v5-patch-for-react-19';

const { Option } = Select;
const { TabPane } = Tabs;

const UserDetails = () => {
  const { token } = useSelector((state) => state.auth);
  const { userId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    if (userId && token) {
      fetchUserDetails(userId);
    }
  }, [userId, token]);

  useEffect(() => {
    if (userId) {
      fetchTransactions(userId);
    }
  }, [transactionType, startDate, endDate, userId]);

  const fetchUserDetails = async (userId) => {
    try {
      const data = await getUserAccountDetails(userId, token);
      if (data) {
        setUserDetails(data);
      } else {
        message.error("No user details found");
      }
    } catch (error) {
      message.error("Failed to fetch user details");
    }
  };

  const fetchTransactions = async (userId) => {
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

  const transactionColumns = [
    { title: "Sender Name", dataIndex: "senderName", key: "senderName" },
    { title: "Receiver Name", dataIndex: "receiverName", key: "receiverName" },
    { title: "Amount", dataIndex: "amount", key: "amount", render: (amount,record) => (
        <span style={{ color: record.type ==="Deposit" ? "green" : record.type === "Withdraw" ? "red" : "blue" }}>{`$${amount}`}</span>
      ) },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Date", dataIndex: "transactionDate", key: "transactionDate" },
  ];

  return (
    <Card title="User Details">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Account Details" key="1">
          <p>Full Name: {userDetails.fullName}</p>
          <p>Email: {userDetails.email}</p>
          <p>Account Number: {userDetails.accountNumber}</p>
          <p>Account Type: {userDetails.accountType}</p>
          <p>Balance: ${userDetails.balance}</p>
        </TabPane>
        <TabPane tab="Transaction History" key="2">
          <div style={{ marginBottom: "20px" }}>
            <Select
              placeholder="Select Transaction Type"
              onChange={setTransactionType}
              value={transactionType}
              style={{ width: 200, marginRight: 10 }}
              allowClear
            >
              <Option value="Deposit">Deposit</Option>
              <Option value="Withdraw">Withdraw</Option>
              <Option value="Transfer">Transfer</Option>
            </Select>
            <DatePicker
              placeholder="Start Date"
              onChange={(date) => {
                setStartDate(date);
                setEndDate(null);
              }}
              value={startDate}
              disabledDate={(current) => current && current > new Date()}
              style={{ marginRight: 10 }}
            />
            <DatePicker
              placeholder="End Date"
              onChange={setEndDate}
              value={endDate}
              disabledDate={(current) =>
                current && (current > new Date() || (startDate && current < startDate))
              }
              style={{ marginRight: 10 }}
              disabled={!startDate}
            />
            <Button onClick={() => { setTransactionType(''); setStartDate(null); setEndDate(null); }}>Reset</Button>
          </div>
          <Table
            dataSource={transactions}
            columns={transactionColumns}
            rowKey="transactionId"
            style={{ marginTop: "20px" }}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default UserDetails;
