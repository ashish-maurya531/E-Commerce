"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Layout, Menu, Button, Typography, Avatar, Dropdown, Space, Badge, Breadcrumb } from "antd"
import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  InboxOutlined,
} from "@ant-design/icons"

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Get current page title based on path
  const getPageTitle = () => {
    const path = location.pathname.split("/").pop()
    switch (path) {
      case "dashboard":
        return "Dashboard"
      case "products":
        return "Products Management"
      case "orders":
        return "Orders Management"
      case "inventory":
        return "Inventory Management"
      case "users":
        return "User Management"
      case "categories":
        return "Categories Management"
      case "reports":
        return "Reports & Analytics"
      case "settings":
        return "Settings"
      default:
        return "Dashboard"
    } 
  }

  // Get breadcrumb items based on path
  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split("/").filter((segment) => segment)
    return pathSegments.map((segment, index) => {
      const url = `/${pathSegments.slice(0, index + 1).join("/")}`
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: url,
      }
    })
  }

  const breadcrumbItems = getBreadcrumbItems()

  // User dropdown menu
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => navigate("/admin")}>
        Logout
      </Menu.Item>
    </Menu>
  )

  // Notifications dropdown menu
  const notificationsMenu = (
    <Menu>
      <Menu.Item key="notification1">
        <Text strong>New Order Received</Text>
        <Text type="secondary" style={{ display: "block" }}>
          Order #12345 - 10 minutes ago
        </Text>
      </Menu.Item>
      <Menu.Item key="notification2">
        <Text strong>Low Stock Alert</Text>
        <Text type="secondary" style={{ display: "block" }}>
          Royal Attar Perfume - 5 items left
        </Text>
      </Menu.Item>
      <Menu.Item key="notification3">
        <Text strong>New User Registration</Text>
        <Text type="secondary" style={{ display: "block" }}>
          Rahul S. - 1 hour ago
        </Text>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="viewAll">
        <Button type="link" style={{ padding: 0 }}>
          View All Notifications
        </Button>
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          background: "#001529",
        }}
      >
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "0" : "0 16px",
            color: "#fff",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            whiteSpace: "nowrap",
            width: collapsed ? "40px" : "120px", // Adjust width smoothly
            transition: "width 0.3s ease, opacity 0.3s ease",
            opacity: collapsed ? 1 : 1, // Avoid sudden flickering
          }}
        >
          💊
          <span style={{ 
            marginLeft: collapsed ? "0px" : "8px",
            opacity: collapsed ? 0 : 1,
            transition: "opacity 0.3s ease, margin-left 0.3s ease"
          }}>
            Medic
          </span>
        </div>

        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname.split("/").pop() || "dashboard"]}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: <Link to="/admin/dashboard">Dashboard</Link>,
            },
            {
              key: "categories",
              icon: <AppstoreOutlined />,
              label: <Link to="/admin/categories">Categories</Link>,
            },
            {
              key: "products",
              icon: <ShoppingOutlined />,
              label: <Link to="/admin/products">Products</Link>,
            },
            {
              key: "inventory",
              icon: <InboxOutlined />,
              label: <Link to="/admin/inventory">Inventory</Link>,
            },
            {
              key: "users",
              icon: <UserOutlined />,
              label: <Link to="/admin/users">Users</Link>,
            },
            {
              key: "orders",
              icon: <ShoppingCartOutlined />,
              label: <Link to="/admin/orders">Orders</Link>,
            },
            {
              key: "reports",
              icon: <BarChartOutlined />,
              label: <Link to="/admin/reports">Reports</Link>,
            },
            {
              key: "settings",
              icon: <SettingOutlined />,
              label: <Link to="/admin/settings">Settings</Link>,
            },
          ]}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "all 0.2s" }}>
        <Header
          style={{
            padding: "0 16px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />
            <Title level={4} style={{ margin: 0 }}>
              {getPageTitle()}
            </Title>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Dropdown overlay={notificationsMenu} trigger={["click"]} placement="bottomRight">
              <Badge count={3} size="small">
                <Button type="text" icon={<BellOutlined style={{ fontSize: "18px" }} />} />
              </Badge>
            </Dropdown>

            <Dropdown overlay={userMenu} trigger={["click"]} placement="bottomRight">
              <Space>
                <Avatar icon={<UserOutlined />} />
                <span>Admin User</span>
              </Space>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: "16px", padding: "16px", background: "#fff", minHeight: 280 }}>
          <Breadcrumb style={{ marginBottom: "16px" }}>
            {breadcrumbItems.map((item, index) => (
              <Breadcrumb.Item key={index}>
                {index === breadcrumbItems.length - 1 ? item.title : <Link to={item.href}>{item.title}</Link>}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>

          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout

