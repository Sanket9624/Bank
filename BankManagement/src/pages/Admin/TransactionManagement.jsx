import React, { useState, useEffect } from "react";
import { Button, message, Select } from "antd";
import "@ant-design/v5-patch-for-react-19";
import { getTransactions } from "../../services/bankManagerService";
import { useSelector } from "react-redux";
import ReusableDatePicker from "../../Components/DatePicker";
import ReusableTable from "../../Components/Table";
import { saveAs } from "file-saver";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Option } = Select;

const TransactionManagement = () => {
  const { token } = useSelector((state) => state.auth);
  const [transactions, setTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState("All");
  const [status, setStatus] = useState("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [token, transactionType, status, startDate, endDate]);

  const fetchTransactions = async () => {
    try {
      const filters = {
        ...(transactionType !== "All" && { transactionType }),
        ...(status !== "All" && { status }),
        ...(startDate && { startDate: startDate.format("YYYY-MM-DD") }),
        ...(endDate && { endDate: endDate.format("YYYY-MM-DD") }),
      };

      const data = await getTransactions(filters, token);
      setTransactions(data);
    } catch (error) {
      message.error("Failed to fetch transactions.");
    }
  };

  const resetFilters = () => {
    setTransactionType("All");
    setStatus("All");
    setStartDate(null);
    setEndDate(null);
  };

  const exportToCSV = () => {
    if (transactions.length === 0) {
      message.warning("No data available to export.");
      return;
    }
  
    const ws = utils.json_to_sheet(transactions);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Transactions");
    writeFile(wb, "transactions.xlsx");
    message.success("CSV downloaded successfully.");
  };
  

  const exportToPDF = () => {
    if (transactions.length === 0) {
      message.warning("No data available to export.");
      return;
    }
  
    const doc = new jsPDF();
    doc.text("Transaction Report", 14, 10);
  
    autoTable(doc, {
      head: [["Sender", "Receiver", "Amount", "Type", "Date", "Status"]],
      body: transactions.map((tx) => [
        tx.senderName,
        tx.receiverName,
        `₹${tx.amount}`,
        tx.type,
        tx.transactionDate,
        tx.status,
      ]),
    });
  
    doc.save("transactions.pdf");
    message.success("PDF downloaded successfully.");
  };
  

  const columns = [
    { title: "Sender Name", dataIndex: "senderName", key: "senderName" },
    { title: "Receiver Name", dataIndex: "receiverName", key: "receiverName" },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
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
          {`₹${amount}`}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      sorter: (a, b) => new Date(a.transactionDate) - new Date(b.transactionDate),
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
    <div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <h3 style={{ margin: 0 }}>Filter Transactions:</h3>
        <Select onChange={setTransactionType} value={transactionType} style={{ width: 200 }}>
          <Option value="All">All</Option>
          <Option value="Deposit">Deposit</Option>
          <Option value="Withdraw">Withdraw</Option>
          <Option value="Transfer">Transfer</Option>
        </Select>
        <Select onChange={setStatus} value={status} style={{ width: 200 }}>
          <Option value="All">All</Option>
          <Option value="Approved">Approved</Option>
          <Option value="Rejected">Rejected</Option>
        </Select>
        <ReusableDatePicker placeholder="Start Date" onChange={setStartDate} value={startDate} />
        <ReusableDatePicker placeholder="End Date" onChange={setEndDate} value={endDate} disabled={!startDate} />
        <Button onClick={resetFilters}>Reset</Button>
        <Button onClick={exportToCSV}>Export to CSV</Button>
        <Button onClick={exportToPDF}>Export to PDF</Button>
      </div>
      <ReusableTable dataSource={transactions} columns={columns} rowKey="transactionId" style={{ marginTop: "20px" }} />
    </div>
  );
};

export default TransactionManagement;
