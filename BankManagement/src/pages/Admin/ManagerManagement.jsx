import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, message, Popconfirm, Select } from "antd";
import { getAllBankManagers, createUser, updateUser, deleteUser, getAllRoles } from "../../services/adminService";
import { useSelector } from "react-redux";

const { Option } = Select;

const ManagerManagement = () => {
  const { token } = useSelector((state) => state.auth);
  const [managers, setManagers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchManagers();
    fetchRoles();
  }, [token]);

  const fetchManagers = async () => {
    try {
      const managerList = await getAllBankManagers(token);
      setManagers(managerList);
    } catch (error) {
      message.error("Failed to fetch managers");
    }
  };

  const fetchRoles = async () => {
    try {
      const rolesList = await getAllRoles(token);
      setRoles(rolesList.filter(role => role.roleId !== 1 && role.roleId !== 3));
    } catch (error) {
      message.error("Failed to fetch roles");
    }
  };

  const handleCreateManager = async (values) => {
    try {
      await createUser(values, token);
      message.success("Manager created successfully");
      fetchManagers();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to create manager");
    }
  };

  const handleUpdateManager = async (values) => {
    try {
      await updateUser(editingManager.userId, values, token);
      message.success("Manager updated successfully");
      fetchManagers();
      setIsModalOpen(false);
      setEditingManager(null);
      form.resetFields();
    } catch (error) {
      message.error("Failed to update manager");
    }
  };

  const handleDeleteManager = async (userId) => {
    try {
      await deleteUser(userId, token);
      message.success("Manager deleted successfully");
      fetchManagers();
    } catch (error) {
      message.error("Failed to delete manager");
    }
  };

  const handleEdit = (manager) => {
    setEditingManager(manager);
    form.setFieldsValue({
      firstName: manager.firstName,
      lastName: manager.lastName,
      mobileNo: manager.mobileNo,
      address: manager.address,
    });
    setIsModalOpen(true);
  };

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
          <Button type="link" onClick={() => handleEdit(manager)}>Edit</Button>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDeleteManager(manager.userId)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Manager Management</h2>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
        Create Manager
      </Button>
      <Table dataSource={managers} columns={columns} rowKey="userId" />

      <Modal
        title={editingManager ? "Edit Manager" : "Create Manager"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingManager(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingManager ? handleUpdateManager : handleCreateManager}
          layout="vertical"
        >
          <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: "Please enter first name" }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: "Please enter last name" }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="mobileNo" label="Mobile No" rules={[{ required: true, message: "Please enter mobile number" }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true, message: "Please enter address" }]}> 
            <Input />
          </Form.Item>
          {!editingManager && (
            <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please enter email" }]}> 
              <Input />
            </Form.Item>
          )}
          {!editingManager && (
            <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please enter password" }]}> 
              <Input.Password />
            </Form.Item>
          )}
          {!editingManager && (
          <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true, message: "Please select date of birth" }]}> 
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          )}
          {!editingManager && (
            <Form.Item name="roleId" label="Role" rules={[{ required: true, message: "Please select role" }]}> 
              <Select>
                {roles.map((role) => (
                  <Option key={role.roleId} value={role.roleId}>{role.roleName}</Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Button type="primary" htmlType="submit">
            {editingManager ? "Update Manager" : "Create Manager"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ManagerManagement;
