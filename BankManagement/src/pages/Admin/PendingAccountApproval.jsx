import React, { useEffect, useState, useCallback } from "react";
import { Button, message, Modal, Input } from "antd";
import {
  getUsersWithStatus,
  approveAccount,
} from "../../services/adminService";
import { useSelector } from "react-redux";
import ReusableTable from "../../Components/Table";
import "@ant-design/v5-patch-for-react-19";

const PendingAccountApproval = () => {
  const { token } = useSelector((state) => state.auth);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  
  // Fetch pending users
  const fetchPendingUsers = useCallback(async () => {
    setLoading(true);
    try {
      const users = await getUsersWithStatus(token);
      setPendingUsers(users);
    } catch (error) {
      message.error("Failed to fetch pending accounts.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPendingUsers();
  }, [fetchPendingUsers]);

  // Handle account approval or rejection
  const handleApproval = async (userId, isApproved, reason = "") => {
    try {
      await approveAccount(userId, isApproved, reason, token);
      message.success(
        `User ${isApproved ? "approved" : "rejected"} successfully.`
      );
      setPendingUsers((prev) => prev.filter((user) => user.userId !== userId));
      setIsRejectModalVisible(false);
      setRejectReason("");
    } catch (error) {
      message.error("Failed to process the request.");
    }
  };

  // Open reject modal
  const openRejectModal = (userId) => {
    setSelectedUserId(userId);
    setIsRejectModalVisible(true);
  };

  // Confirm rejection
  const handleRejectConfirm = () => {
    if (selectedUserId) {
      handleApproval(selectedUserId, false, rejectReason);
    }
  };

  // Table columns configuration
  const columns = [
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" }, 
    {
      title: "Email Verified",
      dataIndex: "isEmailVerified",
      key: "isEmailVerified",
      render: (verified) => (verified ? "Yes" : "No"),
    },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "AccountType", dataIndex: "accountType", key: "accountType" },
    { title: "Status", dataIndex: "requestStatus", key: "requestStatus" },
    {
      title: "Actions",
      key: "actions",
      render: (user) => (
        <>
          <Button
            type="primary"
            onClick={() => handleApproval(user.userId, true)}
          >
            Approve
          </Button>
          <Button
            danger
            onClick={() => openRejectModal(user.userId)}
            style={{ marginLeft: "10px" }}
          >
            Reject
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Pending Account Approvals</h2>
      <ReusableTable
        columns={columns}
        dataSource={pendingUsers}
        rowKey="userId"
        loading={loading}
        style={{ marginTop: "20px" }}
      />

      {/* Reject Modal */}
      <Modal
        title="Reject Account Request"
        open={isRejectModalVisible}
        onOk={handleRejectConfirm}
        onCancel={() => setIsRejectModalVisible(false)}
      >
        <p>Optional: Provide a reason for rejection</p>
        <Input.TextArea
          rows={3}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Enter reason (optional)"
        />
      </Modal>
    </div>
  );
};

export default PendingAccountApproval;
