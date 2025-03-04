import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import BankingOperations from "../pages/Customer/BankingOperation";
import TransactionHistory from "../pages/Customer/TransactionHistory";
import Sidebar from "../Components/SideBar";
// import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../Components/Navbar";
import RoleManagement from "../pages/Admin/RoleManagement";
import UserManagement from "../pages/Admin/UserManagement";
import ManagerManagement from "../pages/Admin/ManagerManagement";
// import DashboardBankManager from "../pages/Dashboard/DashboardBankManager";
import TransactionManagement from "../pages/Admin/TransactionManagement";
import UserDetails from "../pages/Admin/UserDetails";

const AppRouter = () => {
  const { token } = useSelector((state) => state.auth);

  return (
    <Router>
      <Navbar />
      <div style={{ display: "flex" }}>
        {token && <Sidebar />}
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            {token ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/banking-operations" element={<BankingOperations />} />
                <Route path="/transaction-history" element={<TransactionHistory />} />
                <Route path="/role-management" element={<RoleManagement />} />
                <Route path="/customer-management" element={<UserManagement />} />
                <Route path="/manager-management" element={<ManagerManagement />} />
                <Route path="/transaction-management" element={<TransactionManagement />} />
                <Route path="/user-list" element={<UserManagement />} />
                <Route path="/user-account/:userId" element={<UserDetails />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRouter;