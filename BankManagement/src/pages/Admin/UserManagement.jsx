import React, { useState, useEffect } from "react";
import { Button, Input, Table, message, Modal, Form, Tabs } from "antd";
import { getAllUsers, updateUser } from "../../services/adminService";
import { getTransactions, getUserAccountDetails } from "../../services/bankManagerService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import '@ant-design/v5-patch-for-react-19';


const { TabPane } = Tabs;

const UserManagement = () => {
  const { token, role } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const userList = await getAllUsers(token);
      setUsers(userList);
    } catch (error) {
      message.error("Failed to fetch users");
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const userDetails = await getUserAccountDetails(userId, token);
      return userDetails;
    } catch (error) {
      message.error("Failed to fetch user account details");
    }
  };

  const fetchTransactions = async (userId) => {
    try {
      const transactionsList = await getTransactions({ userId }, token);
      return transactionsList;
    } catch (error) {
      message.error("Failed to fetch user transactions");
    }
  };

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

  const handleViewDetails = async (user) => {
    const userDetails = await fetchUserDetails(user.userId);
    const transactions = await fetchTransactions(user.userId);
    navigate(`/user-account/${user.userId}`, { state: { userDetails, transactions } });
  };

  const columns = [
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mobile No", dataIndex: "mobileNo", key: "mobileNo" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Actions",
      key: "actions",
      render: (user) => (
        <>
          {role === "superadmin" && (
            <>
              <Button type="link" onClick={() => handleEditUser(user)}>
                Edit
              </Button>
            </>
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
      <Table dataSource={users} columns={columns} rowKey="userId" style={{ marginTop: "20px" }} />

      <Modal
        title="Edit User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdateUser}>
          <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please enter first name' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Please enter last name' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="mobileNo" label="Mobile No" rules={[{ required: true, message: 'Please enter mobile number' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please enter Address' }]}> 
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
