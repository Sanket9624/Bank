import React, { useState, useEffect, useCallback } from "react";
import { Button, Input, message } from "antd";
import {
  createRole,
  getAllRoles,
  deleteRole,
} from "../../services/adminService";
import { useSelector } from "react-redux";
import ReusableTable from "../../Components/Table";

const RoleManagement = () => {
  const { token } = useSelector((state) => state.auth);

  // State for roles list
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Fetches the list of roles from the API.
   */
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const rolesList = await getAllRoles(token);
      setRoles(rolesList);
    } catch (error) {
      message.error("Failed to fetch roles. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  /**
   * Handles role creation.
   */
  const handleCreateRole = async () => {
    if (!newRole.trim()) {
      message.error("Role name cannot be empty.");
      return;
    }

    try {
      await createRole(newRole, token);
      message.success("Role created successfully.");
      setNewRole("");
      fetchRoles(); // Refresh roles list
    } catch (error) {
      message.error("Failed to create role. Please try again.");
    }
  };

  /**
   * Handles role deletion.
   * @param {string} roleId - The ID of the role to delete.
   */
  const handleDeleteRole = async (roleId) => {
    try {
      await deleteRole(roleId, token);
      message.success("Role deleted successfully.");
      fetchRoles(); // Refresh roles list
    } catch (error) {
      message.error("Failed to delete role. Please try again.");
    }
  };

  // Define table columns
  const columns = [
    { title: "Role ID", dataIndex: "roleId", key: "roleId" },
    { title: "Role Name", dataIndex: "roleName", key: "roleName" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          danger
          onClick={() => handleDeleteRole(record.roleId)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Role Management</h2>

      <div className="mb-5">
        {/* Input for creating a new role */}
        <Input
          placeholder="Enter Role Name"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          style={{ width: "300px", marginRight: "10px" }}
        />
        <Button type="primary" onClick={handleCreateRole}>
          Create Role
        </Button>
      </div>

      {/* Role List Table */}
      <ReusableTable
        dataSource={roles}
        columns={columns}
        rowKey="roleId"
        loading={loading}
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default RoleManagement;
