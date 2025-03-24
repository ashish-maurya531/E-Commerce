import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Space } from "antd";
import { ShoppingCartOutlined, UserOutlined, SearchOutlined, LogoutOutlined } from "@ant-design/icons";
import CartDrawer from "./CartDrawer";
import "../styles/AppHeader.css"; // Import CSS file

const { Header } = Layout;

const AppHeader = () => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  const [showDropdown, setShowDropdown] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalQuantity);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/auth");
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
      <Header className="app-header">
        <div className="logo">
          <Link to="/">
            <img src="/images/logo.png" alt="UHI" className="logo-img" />
          </Link>
        </div>

        <Menu mode="horizontal" className="menu">
          <Menu.Item key="wellness">
            <Link to="/category/general-wellness">
              <span className="menu-text">General Wellness</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="liver-kidney">
            <Link to="/category/liver-kidney">
              <span className="menu-text">Liver & Kidney Care</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="immunity">
            <Link to="/category/immunity-respiratory">
              <span className="menu-text">Immunity & Respiratory</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="digestive">
            <Link to="/category/digestive-health">
              <span className="menu-text">Digestive Health</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="eye">
            <Link to="/category/eye-care">
              <span className="menu-text">Eye Care</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="new">
            <Link to="/category/new-arrival">
              <span className="menu-text">New Arrivals</span>
            </Link>
          </Menu.Item>
        </Menu>

        <Space size="large">
          <CartDrawer />
          <SearchOutlined className="icon" />
          <div style={{ position: "relative" }} ref={menuRef}>
            <UserOutlined
              className="icon"
              onClick={isAuthenticated ? () => setOpen(!open) : () => navigate("/auth")}
            />
            {open && isAuthenticated && (
              <div className="dropdown-menu">
                <p onClick={() => navigate("/profile")}>Profile</p>
                <p onClick={() => navigate("/settings")}>Settings</p>
                <p className="logout-text" onClick={() => alert("Logging out...")}>
                  Logout
                </p>
              </div>
            )}
          </div>
          {isAuthenticated && <LogoutOutlined className="icon" onClick={handleLogout} />}
        </Space>
      </Header>

      <div className="secondary-nav">
        <Space size="large">
          <Link to="/track-order">Track Order</Link>
          <Link to="/return-order">Return Your Order</Link>
          <Link to="/store-locator">Store Locator</Link>
        </Space>
      </div>
    </>
  );
};

export default AppHeader;