import { createSlice } from "@reduxjs/toolkit";

const roleMapping = {
  1: "superadmin",
  2: "bankmanager",
  3: "customer"
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    roleId: localStorage.getItem("roleId") || null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token, role } = action.payload;

      state.user = user;
      state.token = token;
      state.roleId = user.RoleId;
      state.role = roleMapping[user.RoleId] || "customer";

      localStorage.setItem("token", token);
      localStorage.setItem("roleId", user.RoleId);
      localStorage.setItem("role", state.role);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.roleId = null;
      localStorage.clear();
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;