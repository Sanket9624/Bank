import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ResetPassword from "../pages/Auth/ResetPassword";
import HomePage from "../pages/Home/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedLayout from "./ProtectedLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import BankingOperations from "../pages/Customer/BankingOperation";
import TransactionHistory from "../pages/Customer/TransactionHistory";
import RoleManagement from "../pages/Admin/RoleManagement";
import UserManagement from "../pages/Admin/UserManagement";
import ManagerManagement from "../pages/Admin/ManagerManagement";
import TransactionManagement from "../pages/Admin/TransactionManagement";
import PendingTransactions from "../pages/Admin/PeningTransactions";
import UserDetails from "../pages/Admin/UserDetails";
import PendingAccountApproval from "../pages/Admin/PendingAccountApproval";
import PermissionManagement from "../pages/Admin/PermissionManagement"; // ✅ Added Import
import { ThemeProvider } from "../context/ThemeContext";
import Unauthorized from "../pages/Unauthorized";

const AppRouter = () => {
  const { token } = useSelector((state) => state.auth);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<Login />} />

          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Home Page Route */}
          <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <HomePage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Customer Routes */}
            <Route element={<ProtectedRoute requiredPermissions={["MakeDeposit", "MakeWithdrawal", "MakeTransfer"]}/>}>
              <Route path="/banking-operations" element={<BankingOperations />} />
            </Route>
            <Route element={<ProtectedRoute requiredPermissions={["ViewTransactions", "ViewCustomTransactions"]}/>}>
              <Route path="/transaction-history" element={<TransactionHistory />} />
            </Route>

            {/* Admin & Manager Routes */}
            <Route element={<ProtectedRoute requiredPermissions={[
              "ApproveAccount",
              "ViewPendingTransactions",
              "ApproveTransaction",
              "RejectTransaction",
              "ViewUsers"
            ]}/>}>
              <Route path="/account-management" element={<PendingAccountApproval />} />
              <Route path="/transaction-management" element={<TransactionManagement />} />
              <Route path="/pending-transactions" element={<PendingTransactions />} />
              <Route path="/customer-management" element={<UserManagement />} />
              <Route path="/user-account/:userId" element={<UserDetails />} />
            </Route>

            {/* Superadmin Only Routes */}
            <Route element={<ProtectedRoute requiredPermissions={[
              "CreateRole",
              "DeleteRole",
              "ViewRoles",
              "CreateManager",
              "VerifyManager",
              "ManagePermissions" // ✅ Added Permission for Permission Management
            ]}/>}>
              <Route path="/role-management" element={<RoleManagement />} />
              <Route path="/manager-management" element={<ManagerManagement />} />
              <Route path="/permission-management" element={<PermissionManagement />} /> {/* ✅ New Route */}
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default AppRouter;
