import React, { useEffect, useState } from "react";
import { Select, Checkbox, message, Spin, Table } from "antd";
import { getAllRoles } from "../../services/adminService";
import api from "../../services/api";

const PermissionManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [assignedPermissions, setAssignedPermissions] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await getAllRoles();
      setRoles(response);
    } catch (error) {
      message.error("Failed to fetch roles");
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await api.get("/admin/permissions");
      setPermissions(response.data);
    } catch (error) {
      message.error("Failed to fetch permissions");
    }
  };

  const fetchAssignedPermissions = async (roleId) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/permissions/${roleId}/assigned-permissions`);
      setAssignedPermissions(new Set(response.data.map((perm) => perm.permissionId)));
    } catch (error) {
      message.error("Failed to fetch assigned permissions");
      setAssignedPermissions(new Set());
    }
    setLoading(false);
  };

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    fetchAssignedPermissions(roleId);
  };

  const togglePermission = async (permissionId, isChecked) => {
    if (!selectedRole) return;
  
    try {
      const payload = {
        roleId: selectedRole, // Ensure correct field name
        permissionId: [permissionId], // Make sure it's an array
      };
  
      if (isChecked) {
        await api.post("/admin/permissions/assign", payload);
        message.success("Permission assigned successfully");
      } else {
        await api.post("/admin/permissions/remove", payload);
        message.success("Permission removed successfully");
      }
  
      setAssignedPermissions((prev) => {
        const updated = new Set(prev);
        isChecked ? updated.add(permissionId) : updated.delete(permissionId);
        return updated;
      });
    } catch (error) {
      message.error("Failed to update permission");
    }
  };
  

  const permissionColumns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Permission",
      dataIndex: "permissionName",
      key: "permissionName",
    },
    {
      title: "Assigned",
      key: "assigned",
      render: (_, record) => (
        <Checkbox
          checked={assignedPermissions.has(record.permissionId)}
          onChange={(e) => togglePermission(record.permissionId, e.target.checked)}
          disabled={loading}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Role Permission Management</h2>
      <Select
        placeholder="Select Role"
        onChange={handleRoleChange}
        style={{ width: 250, marginBottom: 20 }}
        value={selectedRole}
      >
        {roles.map((role) => (
          <Select.Option key={role.roleId} value={role.roleId}>
            {role.roleName}
          </Select.Option>
        ))}
      </Select>
      <Spin spinning={loading}>
        <Table
          columns={permissionColumns}
          dataSource={permissions.map((perm, index) => ({ ...perm, index }))}
          rowKey="permissionId"
          pagination={false}
        />
      </Spin>
    </div>
  );
};

export default PermissionManagement;
