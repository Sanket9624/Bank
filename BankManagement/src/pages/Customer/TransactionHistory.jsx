import React, { useEffect, useState } from "react";
import { Card, message, Select, Spin, Button } from "antd";
import {
  fetchTransactionHistory,
  fetchCustomTransactionHistory,
} from "../../services/userService";
import { useSelector } from "react-redux";
import ReusableTable from "../../Components/Table";
import ReusableDatePicker from "../../Components/DatePicker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { utils, writeFile } from "xlsx";

const { Option } = Select;

const TransactionHistory = () => {
  const { token } = useSelector((state) => state.auth);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactionType, setTransactionType] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, [token]);

  useEffect(() => {
    fetchFilteredTransactions();
  }, [startDate, endDate, transactionType, statusFilter]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await fetchTransactionHistory(token);
      setTransactions(data);
    } catch {
      message.error("Failed to fetch transaction history.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredTransactions = async () => {
    setLoading(true);
    try {
      const data = await fetchCustomTransactionHistory(
        startDate ? startDate.format("YYYY-MM-DD") : null,
        endDate ? endDate.format("YYYY-MM-DD") : null,
        transactionType,
        statusFilter,
        token
      );
      setTransactions(data);
    } catch {
      message.error("Failed to fetch filtered transactions.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setTransactionType(null);
    setStartDate(null);
    setEndDate(null);
    setStatusFilter(null);
    loadTransactions();
  };

  const disabledDate = (current) =>
    current && current > new Date().setHours(23, 59, 59, 999);

  // Export to CSV
  const exportToCSV = () => {
    if (transactions.length === 0) {
      message.warning("No data available to export.");
      return;
    }

    const ws = utils.json_to_sheet(transactions);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Transactions");
    writeFile(wb, "transaction_history.xlsx");
    message.success("CSV downloaded successfully.");
  };

// Export to PDF
const exportToPDF = () => {
  if (transactions.length === 0) {
    message.warning("No data available to export.");
    return;
  }

  const doc = new jsPDF();
  doc.text("Transaction History", 14, 10);

  autoTable(doc, {
    head: [["Sender", "Receiver", "Amount (₹)", "Type", "Date", "Status"]],
    body: transactions.map((tx) => [
      tx.senderName,
      tx.receiverName,
      `₹${tx.amount}`, 
      tx.type,
      tx.transactionDate,
      tx.status,
    ]),
  });

  doc.save("transaction_history.pdf");
  message.success("PDF downloaded successfully.");
};


const columns = [
  {
    title: "Sender Name",
    dataIndex: "senderName",
    key: "senderName",
    sorter: (a, b) => a.senderName.localeCompare(b.senderName),
  },
  {
    title: "Receiver Name",
    dataIndex: "receiverName",
    key: "receiverName",
    sorter: (a, b) => a.receiverName.localeCompare(b.receiverName),
  },
  {
    title: "Amount (₹)",
    dataIndex: "amount",
    key: "amount",
    sorter: (a, b) => a.amount - b.amount,
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
        ₹{amount.toFixed(2)}
      </span>
    ),
  },
  {
    title: "Transaction Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Transaction Date",
    dataIndex: "transactionDate",
    key: "transactionDate",
    sorter: (a, b) =>
      new Date(a.transactionDate) - new Date(b.transactionDate),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <span style={{ color: status === "Approved" ? "green" : "red" }}>
        {status}
      </span>
    ),
  },
];


  return (
    <div style={{ padding: 30 }}>
      <Card title="Transaction History" bordered={false} className="shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Filter Transactions</h3>

        {/* FILTER SECTION */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <Select
            placeholder="Transaction Type"
            onChange={setTransactionType}
            value={transactionType}
            style={{ width: 200 }}
            allowClear
          >
            <Option value={null}>All</Option>
            <Option value="Deposit">Deposit</Option>
            <Option value="Withdraw">Withdraw</Option>
            <Option value="Transfer">Transfer</Option>
          </Select>

          {/* Reusable DatePicker for Start Date */}
          <ReusableDatePicker
            placeholder="Start Date"
            value={startDate}
            onChange={setStartDate}
            disabledDate={disabledDate}
            fullWidth={false}
          />

          {/* Reusable DatePicker for End Date */}
          <ReusableDatePicker
            placeholder="End Date"
            value={endDate}
            onChange={setEndDate}
            disabledDate={disabledDate}
            fullWidth={false}
          />

          <Select
            placeholder="Status"
            onChange={setStatusFilter}
            value={statusFilter}
            style={{ width: 150 }}
            allowClear
          >
            <Option value={null}>All</Option>
            <Option value="Approved">Approved</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>

          <Button onClick={resetFilters} type="primary" danger>
            Reset Filters
          </Button>

          <Button onClick={exportToCSV} type="default">
            Export to CSV
          </Button>

          <Button onClick={exportToPDF} type="default">
            Export to PDF
          </Button>
        </div>

        {/* TABLE SECTION */}
        <ReusableTable
          columns={columns}
          dataSource={transactions}
          loading={loading}
          rowKey="transactionId"
        />
      </Card>
    </div>
  );
};

export default TransactionHistory;
