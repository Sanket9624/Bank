import { useState, useEffect } from "react";
import { Layout, Button, Drawer, Dropdown, Menu, Switch, message } from "antd";
import { LogoutOutlined, UserOutlined, MenuOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { fetchTwoFactorStatus, toggleTwoFactor } from "../services/authService";

const { Header } = Layout;

const Navbar = () => {
  // Get authentication state
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Component state
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Fetch Two-Factor Authentication (2FA) status
  useEffect(() => {
    if (token) {
      fetchTwoFactorStatus()
        .then((status) => setTwoFactorEnabled(status.isEnabled))
        .catch(() => message.error("Failed to fetch 2FA status"));
    }
  }, [token]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Toggle 2FA status
  const handleToggleTwoFactor = async (checked) => {
    setLoading(true);
    try {
      await toggleTwoFactor({ twoFactorEnabled: checked });
      const updatedStatus = await fetchTwoFactorStatus();
      setTwoFactorEnabled(updatedStatus.isEnabled);
      message.success(`2FA ${checked ? "enabled" : "disabled"} successfully.`);
    } catch (error) {
      message.error("Failed to update 2FA status.");
    } finally {
      setLoading(false);
    }
  };

  // Profile dropdown menu
  const profileMenuItems = [
    {
      key: "2fa",
      label: (
        <div className="flex justify-between items-center w-full">
          <span>Two-Factor Auth</span>
          <Switch checked={twoFactorEnabled} onChange={handleToggleTwoFactor} loading={loading} />
        </div>
      ),
    },
    {
      key: "logout",
      label: (
        <div className="flex items-center space-x-2 text-red-500" onClick={handleLogout}>
          <LogoutOutlined /> <span>Logout</span>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Navbar */}
      <Header className="relative flex items-center justify-between bg-black/80 text-white px-5 py-4 shadow-md dark:bg-gray-900">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            type="text"
            icon={<MenuOutlined className="text-white text-xl" />}
            className="lg:hidden"
            onClick={() => setDrawerVisible(true)}
          />

          {/* Application Title */}
          <h2 className="text-lg sm:text-xl font-semibold text-white drop-shadow-md">
            Banking Management System
          </h2>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition"
          >
            {darkMode ? <SunOutlined /> : <MoonOutlined />}
          </button>

          {/* Profile Dropdown (Only when logged in) */}
          {token && (
            <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" trigger={["click"]}>
              <Button type="primary" className="flex items-center">
                <UserOutlined className="mr-1" /> Profile
              </Button>
            </Dropdown>
          )}
        </div>
      </Header>

      {/* Mobile Navigation Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        closable
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible} // Updated from `visible` to `open`
        className="lg:hidden"
      >
        <Menu className="w-full">
          <Menu.Item key="dashboard">
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="transaction-history">
            <Link to="/transaction-history">Transaction History</Link>
          </Menu.Item>
          <Menu.Item key="logout" onClick={handleLogout} className="text-red-500">
            <LogoutOutlined /> Logout
          </Menu.Item>
        </Menu>
      </Drawer>
    </>
  );
};

export default Navbar;
