import React, { useState, useEffect, useCallback } from "react";
import { Button, message, Modal, Input } from "antd";
import {
  getPendingTransactions,
  approveTransaction,
  rejectTransaction,
} from "../../services/bankManagerService";
import { useSelector } from "react-redux";
import ReusableTable from "../../Components/Table";

const PendingTransactions = () => {
  const { token } = useSelector((state) => state.auth);

  // State to store pending transactions
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // State to manage rejection modal
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  /**
   * Fetches pending transactions from the server.
   */
  const fetchPendingTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPendingTransactions(token);
      setTransactions(data);
    } catch (error) {
      message.error("Failed to fetch pending transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch transactions on component mount
  useEffect(() => {
    fetchPendingTransactions();
  }, [fetchPendingTransactions]);

  /**
   * Handles transaction approval.
   * @param {string} transactionId - ID of the transaction to approve
   */
  const handleApprove = async (transactionId) => {
    try {
      await approveTransaction(transactionId, token);
      message.success("Transaction approved successfully.");
      fetchPendingTransactions(); // Refresh transaction list
    } catch (error) {
      message.error("Failed to approve transaction. Please try again.");
    }
  };

  /**
   * Handles transaction rejection.
   */
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.error("Please provide a reason for rejection.");
      return;
    }

    try {
      await rejectTransaction(selectedTransactionId, rejectReason, token);
      message.success("Transaction rejected successfully.");
      setRejectModalVisible(false);
      setRejectReason("");
      fetchPendingTransactions(); // Refresh transaction list
    } catch (error) {
      message.error("Failed to reject transaction. Please try again.");
    }
  };

  /**
   * Opens the reject modal for a specific transaction.
   * @param {string} transactionId - ID of the transaction to reject
   */
  const openRejectModal = (transactionId) => {
    setSelectedTransactionId(transactionId);
    setRejectModalVisible(true);
  };

  // Define table columns
  const columns = [
    { title: "Sender Name", dataIndex: "senderName", key: "senderName" },
    { title: "Receiver Name", dataIndex: "receiverName", key: "receiverName" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Date", dataIndex: "transactionDate", key: "transactionDate" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleApprove(record.transactionId)}
          >
            Approve
          </Button>
          <Button
            danger
            onClick={() => openRejectModal(record.transactionId)}
            style={{ marginLeft: 10 }}
          >
            Reject
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h3>Pending Transactions</h3>

      {/* ReusableTable Component */}
      <ReusableTable
        dataSource={transactions}
        columns={columns}
        rowKey="transactionId"
        loading={loading}
      />

      {/* Reject Transaction Modal */}
      <Modal
        title="Reject Transaction"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => setRejectModalVisible(false)}
        okText="Confirm Rejection"
      >
        <Input.TextArea
          rows={4}
          placeholder="Enter rejection reason"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default PendingTransactions;
