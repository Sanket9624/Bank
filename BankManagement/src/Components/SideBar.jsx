import React, { useState } from "react";
import { Menu, Button } from "antd";
import { Link } from "react-router-dom";
import {
  DashboardOutlined,
  BankOutlined,
  HistoryOutlined,
  TeamOutlined,
  UserOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { token, role } = useSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);

  if (!token) return null;

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = {
    customer: [
      { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard", path: "/dashboard" },
      { key: "banking-operations", icon: <BankOutlined />, label: "Banking Operations", path: "/banking-operations" },
      { key: "transaction-history", icon: <HistoryOutlined />, label: "Transaction History", path: "/transaction-history" }
    ],
    bankmanager: [
      { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard", path: "/dashboard" },
      {
        key: "management",
        icon: <SettingOutlined />,
        label: "Management",
        children: [
          { key: "transaction-management", icon: <BankOutlined />, label: "Transaction Management", path: "/transaction-management" },
          { key: "user-list", icon: <UserOutlined />, label: "User List", path: "/user-list" }
        ]
      }
    ],
    superadmin: [
      { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard", path: "/dashboard" },
      {
        key: "admin-management",
        icon: <AppstoreOutlined />,
        label: "Admin Management",
        children: [
          { key: "role-management", icon: <SolutionOutlined />, label: "Role Management", path: "/role-management" },
          { key: "customer-management", icon: <TeamOutlined />, label: "Customer Management", path: "/customer-management" },
          { key: "manager-management", icon: <UserOutlined />, label: "Manager Management", path: "/manager-management" },
          { key: "transaction-management", icon: <BankOutlined />, label: "Transaction Management", path: "/transaction-management" }
        ]
      }
    ]
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#001529", color: "#fff" }}>
      <Button type="primary" onClick={toggleCollapsed} style={{ margin: 16 }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu theme="dark" mode="inline" inlineCollapsed={collapsed} style={{ height: "calc(100% - 56px)" }}>
        {menuItems[role]?.map((item) =>
          item.children ? (
            <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
              {item.children.map((child) => (
                <Menu.Item key={child.key} icon={child.icon}>
                  <Link to={child.path}>{child.label}</Link>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ) : (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          )
        )}
      </Menu>
    </div>
  );
};

export default Sidebar;