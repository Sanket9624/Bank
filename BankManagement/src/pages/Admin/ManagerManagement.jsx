import React, { useEffect, useState, useCallback } from "react";
import { Button, Modal, Form, Input, message, Popconfirm, Select } from "antd";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  getAllBankManagers,
  createUser,
  updateUser,
  deleteUser,
  getAllRoles,
  verifyOtp,
} from "../../services/adminService";
import ReusableTable from "../../Components/Table";
import ReusableDatePicker from "../../Components/DatePicker";

const { Option } = Select;

const ManagerManagement = () => {
  const { token } = useSelector((state) => state.auth);
  const [managers, setManagers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // ✅ Fetch managers on component mount
  useEffect(() => {
    fetchManagers();
    fetchRoles();
  }, [token]);

  /**
   * Fetches the list of bank managers.
   */
  const fetchManagers = useCallback(async () => {
    setLoading(true);
    try {
      const managerList = await getAllBankManagers(token);
      setManagers(managerList);
    } catch (error) {
      message.error("Failed to fetch managers");
    } finally {
      setLoading(false);
    }
  }, [token]);

  /**
   * Fetches available roles for assigning managers.
   */
  const fetchRoles = useCallback(async () => {
    try {
      const rolesList = await getAllRoles(token);
      setRoles(
        rolesList.filter((role) => role.roleId !== 1 && role.roleId !== 3)
      );
    } catch (error) {
      message.error("Failed to fetch roles");
    }
  }, [token]);

  /**
   * Handles manager creation and OTP verification.
   */
  const handleCreateManager = async (values) => {
    try {
      await createUser(values, token);
      setEmail(values.email);
      message.success("OTP Sent For Email Verification");
      setIsOtpModalVisible(true);
      closeModal();
    } catch (error) {
      message.error("Failed to create manager");
    }
  };

  /**
   * Verifies the OTP for manager account activation.
   */
  const handleOtpVerification = async () => {
    try {
      await verifyOtp({ email, otp });
      message.success("Manager Created Successfully.");
      setIsOtpModalVisible(false);
      fetchManagers();
    } catch (error) {
      message.error("Invalid OTP. Please try again.");
    }
  };

  /**
   * Updates manager details.
   */
  const handleUpdateManager = async (values) => {
    try {
      await updateUser(editingManager.userId, values, token);
      message.success("Manager updated successfully");
      fetchManagers();
      closeModal();
    } catch (error) {
      message.error("Failed to update manager");
    }
  };

  /**
   * Deletes a manager by ID.
   */
  const handleDeleteManager = async (userId) => {
    try {
      await deleteUser(userId, token);
      message.success("Manager deleted successfully");
      fetchManagers();
    } catch (error) {
      message.error("Failed to delete manager");
    }
  };

  /**
   * Opens the edit modal and populates fields with manager data.
   */
  const handleEdit = (manager) => {
    setEditingManager(manager);
    form.setFieldsValue({
      firstName: manager.firstName,
      lastName: manager.lastName,
      mobileNo: manager.mobileNo,
      address: manager.address,
      dateOfBirth: manager.dateOfBirth ? dayjs(manager.dateOfBirth) : null,
    });
    setIsModalOpen(true);
  };

  /**
   * Closes the modal and resets the form.
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingManager(null);
    form.resetFields();
  };

  /**
   * Table columns configuration.
   */
  const columns = [
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mobile No", dataIndex: "mobileNo", key: "mobileNo" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Date of Birth", dataIndex: "dateOfBirth", key: "dateOfBirth" },
    {
      title: "Actions",
      key: "actions",
      render: (manager) => (
        <>
          <Button type="link" onClick={() => handleEdit(manager)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDeleteManager(manager.userId)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Manager Management</h2>
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Create Manager
      </Button>

      <ReusableTable
        columns={columns}
        dataSource={managers}
        loading={loading}
        rowKey="userId"
      />

      {/* Manager Modal */}
      <Modal
        title={editingManager ? "Edit Manager" : "Create Manager"}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingManager ? handleUpdateManager : handleCreateManager}
          layout="vertical"
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mobileNo"
            label="Mobile No"
            rules={[{ required: true, message: "Please enter mobile number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input />
          </Form.Item>
          {!editingManager && (
            <>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Please enter email" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
                rules={[
                  { required: true, message: "Please select date of birth" },
                ]}
              >
                <ReusableDatePicker placeholder="Date of Birth" fullWidth />
              </Form.Item>
              <Form.Item
                name="roleId"
                label="Role"
                rules={[{ required: true, message: "Please select role" }]}
              >
                <Select>
                  {roles.map((role) => (
                    <Option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
          <Button type="primary" htmlType="submit">
            {editingManager ? "Update Manager" : "Create Manager"}
          </Button>
        </Form>
      </Modal>

      {/* OTP Verification Modal */}
      <Modal
        title="Verify OTP"
        open={isOtpModalVisible}
        onOk={handleOtpVerification}
        onCancel={() => setIsOtpModalVisible(false)}
        okText="Verify OTP"
      >
        <Input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ManagerManagement;
