import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import DashboardSuperAdmin from "../pages/Dashboard/DashboardSuperAdmin";
import DashboardBankManager from "../pages/Dashboard/DashboardBankManagar";
import DashboardCustomer from "../pages/Dashboard/DashboardCustomer";
import ProtectedRoute from "./ProtectedRoute"; 

const AppRouter = () => {
  const { token, role } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Role-based protected routes */}
        <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
          <Route path="/dashboard/superadmin" element={<DashboardSuperAdmin />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["bankmanager"]} />}>
          <Route path="/dashboard/bankmanager" element={<DashboardBankManager />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="/dashboard/customer" element={<DashboardCustomer />} />
        </Route>

        {/* Default Route */}
        <Route path="/" element={token ? <Navigate to={`/dashboard/${role}`} /> : <Login />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
