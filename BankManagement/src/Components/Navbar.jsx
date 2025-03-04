import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };


  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px", backgroundColor: "#001529", color: "#fff" }}>
      <h2>Banking Management System</h2>
      {token && (
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      )}
    </div>
  );
};

export default Navbar;