import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../Components/SideBar";
import Navbar from "../Components/Navbar";

const ProtectedLayout = () => {
  const { token } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" replace />; // Redirect if not logged in

  return (
    <>
      <Navbar />
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <div>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }
      }>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default ProtectedLayout;
