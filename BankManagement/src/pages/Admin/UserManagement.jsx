import React, { useState, useEffect } from "react";
import { Button, Input, message, Modal, Form } from "antd";
import { getAllUsers, updateUser } from "../../services/adminService";
import {
  getTransactions,
  getUserAccountDetails,
  getUserAccountDetailsByAccountNumber,
} from "../../services/bankManagerService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";
import ReusableTable from "../../Components/Table";

const UserManagement = () => {
  const { token, roleId } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [token]);

  // ✅ Fetch all users and add account details
  const fetchUsers = async () => {
    try {
      const userList = await getAllUsers(token);
      const usersWithAccounts = await Promise.all(
        userList.map(async (user) => {
          const accountDetails = await getUserAccountDetails(user.userId, token);
          return { ...user, accountNumber: accountDetails?.accountNumber || "N/A" };
        })
      );
      setUsers(usersWithAccounts);
    } catch (error) {
      message.error("Failed to fetch users");
    }
  };

  // ✅ Search user by account number and merge with user data
  const handleSearchByAccount = async () => {
    if (!searchQuery) {
      message.warning("Please enter an account number");
      return;
    }

    try {
      const accountDetails = await getUserAccountDetailsByAccountNumber(searchQuery);
      if (!accountDetails) {
        message.error("User not found");
        return;
      }

      // Fetch all users to find extra details
      const allUsers = await getAllUsers(token);
      const matchedUser = allUsers.find((user) => user.email === accountDetails.email);

      const mergedUser = {
        userId: matchedUser?.userId || "N/A",
        firstName: matchedUser?.firstName || accountDetails.fullName.split(" ")[0],
        lastName: matchedUser?.lastName || accountDetails.fullName.split(" ")[1],
        email: accountDetails.email,
        mobileNo: matchedUser?.mobileNo || "N/A",
        address: accountDetails.address,
        accountNumber: accountDetails.accountNumber,
        accountType: accountDetails.accountType,
        balance: accountDetails.balance || "N/A",
        createdAt: accountDetails.createdAt,
        dateOfBirth: matchedUser?.dateOfBirth || "N/A",
        roleName: matchedUser?.roleName || "Customer",
        requestStatus: matchedUser?.requestStatus || "Approved",
      };

      setUsers([mergedUser]);
    } catch (error) {
      message.error("Failed to fetch user by account number");
    }
  };

  // ✅ Handle user edit
  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNo: user.mobileNo,
      address: user.address,
    });
    setIsModalOpen(true);
  };

  // ✅ Update user details
  const handleUpdateUser = async (values) => {
    try {
      await updateUser(editingUser.userId, values, token);
      message.success("User updated successfully");
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      message.error("Failed to update user");
    }
  };

  // ✅ View user details
  const handleViewDetails = async (user) => {
    try {
      const userDetails = await getUserAccountDetails(user.userId, token);
      const transactions = await getTransactions({ userId: user.userId }, token);
      navigate(`/user-account/${user.userId}`, {
        state: { userDetails, transactions },
      });
    } catch (error) {
      message.error("Failed to fetch user details");
    }
  };

  // ✅ Table columns
  const columns = [
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mobile No", dataIndex: "mobileNo", key: "mobileNo" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Account No.", dataIndex: "accountNumber", key: "accountNumber" },
    {
      title: "Actions",
      key: "actions",
      render: (user) => (
        <>
          {roleId === 1 && (
            <Button type="link" onClick={() => handleEditUser(user)}>
              Edit
            </Button>
          )}
          <Button type="link" onClick={() => handleViewDetails(user)}>
            👁️ View Details
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>User Management</h2>

      {/* ✅ Search Input for Account Number */}
      <Input.Search
        placeholder="Enter Account Number"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSearch={handleSearchByAccount}
        enterButton="Search"
        style={{ width: 400, marginBottom: 16 }}
      />

      <ReusableTable
        dataSource={users}
        columns={columns}
        rowKey="accountNumber"
        pagination={{ pageSize: 10 }}
      />

      {/* ✅ Edit User Modal */}
      <Modal
        title="Edit User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdateUser}>
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
            rules={[{ required: true, message: "Please enter Address" }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
