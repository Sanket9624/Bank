import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  createRole,
  getAllRoles,
  deleteRole,
  createUser,
  getAllBankManagers,
  updateManager,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../../services/adminService";
import { fetchUserDetails } from "../../services/authService";

const DashboardSuperAdmin = () => {
  const { token } = useSelector((state) => state.auth);
  const [adminData, setAdminData] = useState(null);
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [bankManagers, setBankManagers] = useState([]);
  const [editManager, setEditManager] = useState(null);
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobileNo: "",
    address: "",
    dateOfBirth: "",
    roleName: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const admin = await fetchUserDetails(token);
        setAdminData(admin);
        const rolesList = await getAllRoles(token);
        setRoles(rolesList);
        const managers = await getAllBankManagers(token);
        setBankManagers(managers);
        const users = await getAllUsers(token);
        setUsers(users)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [token]);

  // Create New Role
  const handleCreateRole = async () => {
    try {
      await createRole(newRole, token);
      alert("Role Created Successfully");
      setRoles(await getAllRoles(token));
      setNewRole("");
    } catch (error) {
      console.error("Failed to create role:", error);
    }
  };

  // Delete Role
  const handleDeleteRole = async (roleId) => {
    try {
      await deleteRole(roleId, token);
      alert("Role Deleted Successfully");
      setRoles(await getAllRoles(token));
    } catch (error) {
      console.error("Failed to delete role:", error);
    }
  };

  // Create New User (Bank Manager / Other)
  const handleCreateUser = async () => {
    try {
      await createUser(newUser, token);
      alert("User Created Successfully");
      setBankManagers(await getAllBankManagers(token));
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        mobileNo: "",
        address: "",
        dateOfBirth: "",
        roleName: "",
      });
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };
  const handleUpdateManager = async (userId, updatedData) => {
    try {
      await updateUser(userId, updatedData, token);
      alert("Manager Updated Successfully");
      setBankManagers(await getAllBankManagers(token));
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };


  // Update User Details
  const handleUpdateUser = async (userId, updatedData) => {
    try {
      await updateUser(userId, updatedData, token);
      alert("User Updated Successfully");
      setBankManagers(await getAllUsers(token));
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId, token);
      alert("User Deleted Successfully");
      setBankManagers(await getAllBankManagers(token));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Admin Details */}
      {adminData && (
        <div className="bg-white p-4 shadow rounded mb-4">
          <h3 className="text-lg font-semibold">Admin Details</h3>
          <p><strong>Full Name:</strong> {adminData.fullName}</p>
          <p><strong>Email:</strong> {adminData.email}</p>
          <p><strong>Role:</strong> {adminData.roleName}</p>
        </div>
      )}

      {/* Create Role */}
      <div className="bg-white p-4 shadow rounded mb-4">
        <h3 className="text-lg font-semibold">Create a New Role</h3>
        <input
          type="text"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Enter Role Name"
          className="border p-2 w-full mb-2 rounded"
        />
        <button onClick={handleCreateRole} className="bg-green-500 text-white p-2 w-full rounded">
          Create Role
        </button>
      </div>

      {/* List Roles */}
      <div className="bg-white p-4 shadow rounded mb-4">
        <h3 className="text-lg font-semibold">Available Roles</h3>
        <ul>
          {roles.map((role) => (
            <li key={role.roleId} className="flex justify-between p-2 border-b">
              {role.roleId}. 
              {role.roleName}
              <button onClick={() => handleDeleteRole(role.roleId)} className="text-red-500">Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Create User */}
      <div className="bg-white p-4 shadow rounded mb-4">
  <h3 className="text-lg font-semibold">Create a New User</h3>
  
  <input type="text" placeholder="First Name" value={newUser.firstName} 
    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} 
    className="border p-2 w-full mb-2 rounded" />

  <input type="text" placeholder="Last Name" value={newUser.lastName} 
    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} 
    className="border p-2 w-full mb-2 rounded" />

  <input type="email" placeholder="Email" value={newUser.email} 
    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
    className="border p-2 w-full mb-2 rounded" />

  <input type="password" placeholder="Password" value={newUser.password} 
    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
    className="border p-2 w-full mb-2 rounded" />

  <input type="text" placeholder="Mobile No" value={newUser.mobileNo} 
    onChange={(e) => setNewUser({ ...newUser, mobileNo: e.target.value })} 
    className="border p-2 w-full mb-2 rounded" />

  <input type="text" placeholder="Address" value={newUser.address} 
    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} 
    className="border p-2 w-full mb-2 rounded" />

  <input type="date" placeholder="Date of Birth" value={newUser.dateOfBirth} 
    onChange={(e) => setNewUser({ ...newUser, dateOfBirth: e.target.value })} 
    className="border p-2 w-full mb-2 rounded" />

  <select value={newUser.roleName} onChange={(e) => setNewUser({ ...newUser, roleName: e.target.value })} 
    className="border p-2 w-full mb-2 rounded">
    <option value="">Select Role</option>
    {roles.map((role) => <option key={role.roleId} value={role.roleName}>{role.roleName}</option>)}
  </select>

  <button onClick={handleCreateUser} className="bg-blue-500 text-white p-2 w-full rounded">
    Create User
  </button>
</div>


      {/* Bank Managers List */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Bank Managers</h3>
        <ul>
          {bankManagers.map((manager) => (
            <li key={manager.userId} className="flex justify-between p-2 border-b">
              {manager.firstName} {' '} {manager.lastName} - {manager.email} - {manager.mobileNo} - {manager.address} - {manager.dateOfBirth}
              <button onClick={() => setEditUser(manager)} className="text-blue-500">Edit</button>
              <button onClick={() => handleDeleteUser(manager.userId)} className="text-red-500">Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {editUser && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <input type="text" value={editUser.firstName} onChange={(e) => setEditUser({ ...editManager, firstName: e.target.value })} className="border p-2 w-full mb-2 rounded" />
            <input type="text" value={editUser.lastName} onChange={(e) => setEditUser({ ...editManager, lastName: e.target.value })} className="border p-2 w-full mb-2 rounded" />
            <input type="email" value={editUser.email} onChange={(e) => setEditUser({ ...editManager, email: e.target.value })} className="border p-2 w-full mb-2 rounded" />
            <button onClick={handleUpdateManager} className="bg-green-500 text-white p-2 w-full rounded">Update Manager</button>
            <button onClick={() => setEditManager(null)} className="mt-2 text-red-500">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold">Customers</h3>
        <ul>
          {users.map((user) => (
            <li key={user.userId} className="flex justify-between p-2 border-b">
              {user.firstName} {' '} {user.lastName} - {user.email} - {user.mobileNo} - {user.address} - {user.roleName} - {user.dateOfBirth} - {user.accountType}
              {/* <button onClick={() => handleDeleteUser(user.userId)} className="text-red-500">Delete</button> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardSuperAdmin;
