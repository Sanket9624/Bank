import React, { useEffect, useState } from "react";
import { Card, Table, message, DatePicker, Button, Select ,Row , Col} from "antd";
import { fetchTransactionHistory, fetchCustomTransactionHistory } from "../../services/userService";
import '@ant-design/v5-patch-for-react-19';
import { useSelector } from "react-redux";

const { RangePicker } = DatePicker;
const { Option } = Select;

const TransactionHistory = () => {
  const { token } = useSelector((state) => state.auth);
  const [transactions, setTransactions] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [transactionType, setTransactionType] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterTriggered, setFilterTriggered] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactionHistory();
        setTransactions(data);
        setFilteredTransactions(data);
      } catch {
        message.error("Failed to fetch transaction history");
      }
    };
    loadTransactions();
  }, [token]);

  const fetchFilteredTransactions = async () => {
    if (!filterTriggered) return;

    const [startDate, endDate] = dateRange.length
      ? dateRange.map((date) => date.format("YYYY-MM-DD"))
      : [null, null];

    try {
      const customTx = await fetchCustomTransactionHistory(startDate, endDate, transactionType);
      setFilteredTransactions(customTx);
      message.success("Transactions filtered successfully.");
    } catch {
      message.error("Failed to fetch filtered transactions.");
    }
  };

  const refreshData = async () => {
    try {
      const data = await fetchTransactionHistory();
      setTransactions(data);
      setFilteredTransactions(data);
      setTransactionType("");
      setDateRange([]);
      setFilterTriggered(false);
    } catch {
      message.error("Failed to refresh data.");
    }
  };

  const disabledDate = (current) => current && current > new Date().setHours(23, 59, 59, 999);

  useEffect(() => {
    if (filterTriggered) {
      fetchFilteredTransactions();
    }
  }, [transactionType, dateRange]);

  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Amount (₹)",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div style={{ padding: "30px" }}>
     <Card title="Transaction History" variant="outlined" className="mt-4">
        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={12}>
            <RangePicker
              value={dateRange}
              onChange={(dates) => {
                setDateRange(dates);
                setFilterTriggered(true);
              }}
              disabledDate={disabledDate}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="Select Transaction Type"
              value={transactionType}
              onChange={(value) => {
                setTransactionType(value);  
                setFilterTriggered(true);
              }}
              style={{ width: "100%" }}
            >
              <Option value="">All</Option>
              <Option value="Deposit">Deposit</Option>
              <Option value="Withdraw">Withdraw</Option>
              <Option value="Transfer">Transfer</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Button onClick={refreshData}  type="default">
              Reset Filter
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredTransactions.map((data, index) => ({ ...data, index }))}
          rowKey="transactionId"
        />
      </Card>
    </div>
  );
};

export default TransactionHistory;
