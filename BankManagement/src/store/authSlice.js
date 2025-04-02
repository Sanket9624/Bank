import { createSlice } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode"; // ✅ Correct import

const TOKEN_KEY = "token";
const DefaultRole = 3; // Default role is customer

// Extract RoleId and Permissions from JWT Token
const getAuthDataFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    console.log("Decoded JWT:", decoded); // Debugging output
    return {
      roleId: parseInt(decoded.RoleId, 10) || DefaultRole,
      permissions: decoded.Permission ? decoded.Permission : [] // ✅ Fix: Correct key name
    };
  } catch (error) {
    console.error("JWT Decode Error:", error);
    return {
      roleId: DefaultRole,
      permissions: []
    };
  }
};

// Initial State
const token = localStorage.getItem(TOKEN_KEY);
const authData = token ? getAuthDataFromToken(token) : { roleId: DefaultRole, permissions: [] };
const initialState = {
  user: null,
  token: token || null,
  roleId: authData.roleId,
  permissions: authData.permissions
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      const authData = getAuthDataFromToken(token);

      state.user = user;
      state.token = token;
      state.roleId = authData.roleId;
      state.permissions = authData.permissions;

      localStorage.setItem(TOKEN_KEY, token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.roleId = DefaultRole;
      state.permissions = [];

      localStorage.removeItem(TOKEN_KEY);
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
