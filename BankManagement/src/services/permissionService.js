import api from "./api";
import { handleApiCall } from "./apiHelper";

// Fetch all permissions
export const getPermissions = async () =>
  handleApiCall(api.get("/admin/permissions"));

// Create a new permission
export const createPermission = async (permissionData) =>
  handleApiCall(api.post("/admin/permissions", permissionData));

// Assign permissions to a role
export const assignPermissionsToRole = async (roleId, permissionIds) =>
  handleApiCall(api.post("/admin/permissions/assign", { roleId, permissionIds }));


// Fetch permissions assigned to a specific role
export const getRolePermissions = async (roleId) =>
  handleApiCall(api.get(`/admin/roles/${roleId}/permissions`));
