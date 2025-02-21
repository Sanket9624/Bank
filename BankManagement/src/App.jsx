// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardSuperAdmin from "./pages/DashboardSuperAdmin";
import DashboardBankManager from "./pages/DashboardBankManager";
import DashboardCustomer from "./pages/DashboardCustomer";
import Login from "./pages/Login";
import ProtectedRoute from "../routes/ProtectedRoute";

function App() {
  const { role } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Role-based Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
          <Route path="/dashboard/superadmin" element={<DashboardSuperAdmin />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["bankmanager"]} />}>
          <Route path="/dashboard/bankmanager" element={<DashboardBankManager />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="/dashboard/customer" element={<DashboardCustomer />} />
        </Route>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
