import React, { useState, useEffect } from "react";
import { Button, Table, message, DatePicker, Select} from "antd";
import '@ant-design/v5-patch-for-react-19';
import { getTransactions } from "../../services/bankManagerService";
import { useSelector } from "react-redux";


const { Option } = Select;

const TransactionManagement = () => {
  const { token, role } = useSelector((state) => state.auth);
  const [transactions, setTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [token, transactionType, startDate, endDate]);

 
  const fetchTransactions = async () => {
    try {
      const filters = {};
      if (transactionType) filters.transactionType = transactionType;
      if (startDate) filters.startDate = startDate.format("YYYY-MM-DD");
      if (endDate) filters.endDate = endDate.format("YYYY-MM-DD");
      const data = await getTransactions(filters, token);
      setTransactions(data);
      message.success("Transactions filtered successfully.");

    } catch (error) {
      message.error("Failed to fetch transactions");
    }
  };

  return (
    <div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Filter Transactions</h3>
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
          disabledDate={(current) => current && (current > new Date() || (startDate && current < startDate))}
          style={{ marginRight: 10 }}
          disabled={!startDate}
        />
        <Button onClick={() => { setTransactionType(''); setStartDate(null); setEndDate(null); }}>Reset</Button>
      </div>

      <Table dataSource={transactions} columns={[
        { title: "Sender Name", dataIndex: "senderName", key: "senderName" },
        { title: "Receiver Name", dataIndex: "receiverName", key: "receiverName" },
        { title: "Amount", dataIndex: "amount", key: "amount" , render: (amount,record) => (
          <span style={{ color: record.type === "Deposit" ? "green" : record.type === "Withdraw" ? "red" : "blue" }}>{`$${amount}`}</span>
        ) },
        { title: "Type", dataIndex: "type", key: "type" },
        { title: "Date", dataIndex: "transactionDate", key: "transactionDate" },
      ]} rowKey="transactionId" style={{ marginTop: "20px" }} />

    </div>
  );
};

export default TransactionManagement;