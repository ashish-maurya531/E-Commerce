import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import { Layout, Menu, Badge, Input, Typography, Space } from "antd"
import { ShoppingCartOutlined, UserOutlined, SearchOutlined,LogoutOutlined } from "@ant-design/icons"

const { Header } = Layout
const { Search } = Input
const { Text } = Typography
const menuItemStyle = {
  padding: "0px 15px",
  margin: "0",
  cursor: "pointer",
  fontSize: "14px",
  transition: "background 0.2s",
};
const AppHeader = () => {
  const isAuthenticated = !!localStorage.getItem("authToken"); // Check if user is logged in
  const [showDropdown, setShowDropdown] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove authentication token
    navigate("/auth"); // Redirect to login page
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <>
      {/* Top Banner
      <div
        style={{
          backgroundColor: "#b08d44",
          color: "white",
          padding: "8px 0",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Ramadan Special Offer Buy 3 attars @ ₹899!
      </div> */}

      {/* Main Header */}
      <Header
        style={{
          position: "fixed",
          zIndex: 1000,
          width: "100%",
          background: "#fff",
          padding: "15px 50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div className="logo">
          <Link to="/"
            style={{
              display: "flex",
              alignItems: "center",
              color: "#000",
              textDecoration: "none",
            }}>
            <img src="/images/logo.png" alt="UHI" style={{ height: "40px" }} />
          </Link>
        </div>

        <Menu mode="horizontal" style={{ border: "none", flex: 1, justifyContent: "center" }}>
          <Menu.Item key="buy3">
            <Link to="/buy-3-attars">Buy 3 Attars at ₹899</Link>
          </Menu.Item>
          <Menu.Item key="attar">
            <Link to="/category/attar">Attar</Link>
          </Menu.Item>
          <Menu.Item key="perfume">
            <Link to="/category/perfume-spray">Perfume Spray</Link>
          </Menu.Item>
          <Menu.Item key="royal">
            <Link to="/category/royal-attar">
              <span
                style={{
                  backgroundColor: "#f5f5dc",
                  padding: "2px 8px",
                  borderRadius: "2px",
                  marginRight: "5px",
                }}
              >
                Trending
              </span>
              Royal Attar Perfume
            </Link>
          </Menu.Item>
          <Menu.Item key="body">
            <Link to="/category/body-spray">Body Spray</Link>
          </Menu.Item>
          <Menu.Item key="bakhoor">
            <Link to="/category/bakhoor">Bakhoor</Link>
          </Menu.Item>
          <Menu.Item key="incense">
            <Link to="/category/incense-sticks">Incense Sticks</Link>
          </Menu.Item>
          <Menu.Item key="new">
            <Link to="/category/new-arrival">New Arrival</Link>
          </Menu.Item>
          <Menu.Item key="diffuser">
            <Link to="/category/diffuser-oil">Diffuser Oil</Link>
          </Menu.Item>
        </Menu>

        <Space size="large">
          <Link to="/cart">
            <Badge count={0}>
              <ShoppingCartOutlined style={{ fontSize: "24px", color: "#000" }} />
            </Badge>
          </Link>
          <SearchOutlined style={{ fontSize: "24px", color: "#000" }} />
          <div style={{ position: "relative" }} ref={menuRef}>
      {/* User Icon */}
      <UserOutlined 
        style={{ fontSize: "24px", color: "#000", cursor: "pointer" }} 
        onClick={() => setOpen(!open)} 
      />

      {/* Dropdown Menu */}
      {open && (
        <div 
          style={{
            position: "absolute",
            top: "40px",
            right: "0",
            background: "#fff",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",  // ✨ Improved Shadow
            borderRadius: "8px",
            padding: "2px 0",
            minWidth: "120px",
            zIndex: 1000
          }}
        >
          <p style={menuItemStyle} onClick={() => navigate("/profile")}>Profile</p>
          <p style={menuItemStyle} onClick={() => navigate("/settings")}>Settings</p>
          <p style={{ ...menuItemStyle, color: "red" }} onClick={() => alert("Logging out...")}>Logout</p>
        </div>
      )}
    </div>
          <button 
        onClick={handleLogout} 
        style={{ border: "none", background: "none", cursor: "pointer" }}
      >
        <LogoutOutlined style={{ fontSize: "24px", color: "#000" }} />
      </button>
        </Space>
      </Header>

      {/* Secondary Navigation */}
      <div
        style={{
          background: "#f9f9f0",
          padding: "10px 0",
          textAlign: "center",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Space size="large">
          <Link to="/track-order">Track Order</Link>
          <Link to="/return-order">Return Your Order</Link>
          <Link to="/store-locator">Store Locator</Link>
        </Space>
      </div>
    </>
  )
}

export default AppHeader

