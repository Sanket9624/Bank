import { useState } from "react";
import { Layout, Menu, Drawer } from "antd";
import {
  DashboardOutlined,
  BankOutlined,
  HistoryOutlined,
  TeamOutlined,
  UserOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const { Sider } = Layout;

const Sidebar = ({ onClose, visible }) => {
  // Get roleId from Redux store
  const { roleId } = useSelector((state) => state.auth);
  
  // State for sidebar collapse (desktop mode)
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  /**
   * Role-based menu structure
   * Different menus for Admin (1), Manager (2), and Employee (3)
   */
  const menuItems = {
    3: [
      { key: "dashboard", icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
      { key: "banking-operations", icon: <BankOutlined />, label: <Link to="/banking-operations">Banking Operations</Link> },
      { key: "transaction-history", icon: <HistoryOutlined />, label: <Link to="/transaction-history">Transaction History</Link> },
    ],
    2: [
      { key: "dashboard", icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
      {
        key: "management",
        icon: <SettingOutlined />,
        label: "Management",
        children: [
          { key: "customer-management", icon: <UserOutlined />, label: <Link to="/customer-management">User List</Link> },
          { key: "account-management", icon: <SolutionOutlined />, label: <Link to="/account-management">Account Management</Link> },
          {
            key: "transaction-management",
            icon: <BankOutlined />,
            label: "Transaction Management",
            children: [
              { key: "existing-transaction-management", icon: <BankOutlined />, label: <Link to="/transaction-management">Existing Transactions</Link> },
              { key: "pending-transactions", icon: <BankOutlined />, label: <Link to="/pending-transactions">Pending Transactions</Link> },
            ],
          },
        ],
      },
    ],
    1: [
      { key: "dashboard", icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
      {
        key: "admin-management",
        icon: <AppstoreOutlined />,
        label: "Admin Management",
        children: [
          { key: "role-management", icon: <SolutionOutlined />, label: <Link to="/role-management">Role Management</Link> },
          { key: "permission-management", icon: <SolutionOutlined />, label: <Link to="/permission-management">Permission Management</Link> },
          { key: "account-management", icon: <SolutionOutlined />, label: <Link to="/account-management">Account Management</Link> },
          { key: "customer-management", icon: <TeamOutlined />, label: <Link to="/customer-management">Customer Management</Link> },
          { key: "manager-management", icon: <UserOutlined />, label: <Link to="/manager-management">Manager Management</Link> },
          {
            key: "transaction-management",
            icon: <BankOutlined />,
            label: "Transaction Management",
            children: [
              { key: "existing-transaction-management", icon: <BankOutlined />, label: <Link to="/transaction-management">Existing Transactions</Link> },
              { key: "pending-transactions", icon: <BankOutlined />, label: <Link to="/pending-transactions">Pending Transactions</Link> },
            ],
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* Sidebar (For Large Screens) */}
      <Sider
        collapsible
        collapsed={menuCollapsed}
        onCollapse={setMenuCollapsed}
        breakpoint="lg"
        hidden={visible} // Hide when drawer is open (for mobile)
        style={{ height: "100vh", background: "#001529" }}
      >
        <Menu theme="dark" mode="inline" items={menuItems[roleId]} />
      </Sider>

      {/* Mobile Sidebar (Drawer) */}
      <Drawer
        title="Menu"
        placement="left"
        closable
        onClose={onClose}
        open={visible} 
      >
        <Menu theme="light" mode="inline" items={menuItems[roleId]} />
      </Drawer>
    </>
  );
};

// ✅ PropTypes for type safety
Sidebar.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default Sidebar;
