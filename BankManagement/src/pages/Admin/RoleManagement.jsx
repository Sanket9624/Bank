
import React, { useState, useEffect } from "react";
import { Button, Input, Table, message } from "antd";
import { createRole, getAllRoles, deleteRole } from "../../services/adminService";
import { useSelector } from "react-redux";

const RoleManagement = () => {
  const { token } = useSelector((state) => state.auth);
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesList = await getAllRoles(token);
        setRoles(rolesList);
      } catch (error) {
        message.error("Failed to fetch roles");
      }
    };
    fetchRoles();
  }, [token]);

  const handleCreateRole = async () => {
    try {
      await createRole(newRole, token);
      message.success("Role created successfully");
      setRoles(await getAllRoles(token));
      setNewRole("");
    } catch (error) {
      message.error("Failed to create role");
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      await deleteRole(roleId, token);
      message.success("Role deleted successfully");
      setRoles(await getAllRoles(token));
    } catch (error) {
      message.error("Failed to delete role");
    }
  };

  const columns = [
    { title: "Role ID", dataIndex: "roleId", key: "roleId" },
    { title: "Role Name", dataIndex: "roleName", key: "roleName" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button type="primary" danger onClick={() => handleDeleteRole(record.roleId)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Role Management</h2>
      <Input
        placeholder="Enter Role Name"
        value={newRole}
        onChange={(e) => setNewRole(e.target.value)}
        style={{ width: "300px", marginRight: "10px" }}
      />
      <Button type="primary" onClick={handleCreateRole}>
        Create Role
      </Button>
      <Table dataSource={roles} columns={columns} rowKey="roleId" style={{ marginTop: "20px" }} />
    </div>
  );
};

export default RoleManagement;