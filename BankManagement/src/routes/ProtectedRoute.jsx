import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ requiredPermissions }) => {
  const { permissions } = useSelector((state) => state.auth);

  // Check if the user has at least one of the required permissions
  const hasAccess = requiredPermissions.some((perm) => permissions.includes(perm));

  return hasAccess ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;
