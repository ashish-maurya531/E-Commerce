import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Space } from "antd";
import { ShoppingCartOutlined, UserOutlined, SearchOutlined, LogoutOutlined } from "@ant-design/icons";
import CartDrawer from "./CartDrawer";
import "../styles/AppHeader.css"; // Import CSS file
import axios from "axios";
import { Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
const Src = import.meta.env.VITE_Src;
const { Header } = Layout;

const AppHeader = () => {
  const isAuthenticated = !!(localStorage.getItem("accessToken") || localStorage.getItem("refreshToken"))
  const [showDropdown, setShowDropdown] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${Src}/api/categories/`);
        const filtered = response.data.filter(cat => cat.products_count >= 0);
        // i want to filter first four categories
        const finalFiltered = filtered.slice(0, 4);
        setCategories(finalFiltered);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Utility function to generate a slug from the category name
  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/&/g, "and") // Replace & with 'and'
      .replace(/[^\w\-]+/g, "") // Remove all non-word characters
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start
      .replace(/-+$/, ""); // Trim - from end

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

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      await axios.post(
        'https://gk4rbn12-9000.inc1.devtunnels.ms/api/users/user-logout',
        {
          refreshToken: refreshToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/auth");
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed", error);
    }
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
  <div className="mobile-menu-button">
    <MenuOutlined onClick={() => setDrawerVisible(true)} />
  </div>

  <div className="logo">
    <Link to="/">
      <img src="/images/logo.png" alt="UHI" className="logo-img" />
    </Link>
  </div>

  <Menu mode="horizontal" className="menu">
    {categories.map((category) => {
      const slug = slugify(category.name);
      return (
        <Menu.Item key={category.category_id}>
          <Link to={`/category/${category.category_id}`} className="menu-link">
            <span className="menu-text">{category.name}</span>
          </Link>
        </Menu.Item>
      );
    })}
  </Menu>

  <Space size="large" className="desktop-icons">
    <CartDrawer />
    <SearchOutlined className="icon" />
    <div style={{ position: "relative" }} ref={menuRef}>
      <UserOutlined
        className="icon"
        onClick={isAuthenticated ? () => setOpen(!open) : () => navigate("/auth")}
      />
      {open && isAuthenticated && (
        <div className="dropdown-menu">
          <p onClick={() => navigate("/user-profile")}>Profile</p>
          <p onClick={() => navigate("/settings")}>Settings</p>
          <p className="logout-text" onClick={handleLogout}>Logout</p>
        </div>
      )}
    </div>
    {isAuthenticated && <LogoutOutlined className="icon" onClick={handleLogout} />}
  </Space>

  {/* Mobile Drawer */}
  <Drawer
    title="Menu"
    placement="left"
    onClose={() => setDrawerVisible(false)}
    visible={drawerVisible}
  >
    {categories.map((category) => (
      <p key={category.category_id}>
        <Link to={`/category/${category.category_id}`} onClick={() => setDrawerVisible(false)}>
          {category.name}
        </Link>
      </p>
    ))}
    <hr />
    <Link to="/track-order" onClick={() => setDrawerVisible(false)}>Track Order</Link><br />
    <Link to="/return-order" onClick={() => setDrawerVisible(false)}>Return Your Order</Link><br />
    <Link to="/store-locator" onClick={() => setDrawerVisible(false)}>Store Locator</Link><br />
    {isAuthenticated ? (
      <>
        <Link to="/user-profile" onClick={() => setDrawerVisible(false)}>Profile</Link><br />
        <Link to="/settings" onClick={() => setDrawerVisible(false)}>Settings</Link><br />
        <span className="logout-text" onClick={() => { handleLogout(); setDrawerVisible(false); }}>Logout</span>
      </>
    ) : (
      <Link to="/auth" onClick={() => setDrawerVisible(false)}>Login / Signup</Link>
    )}
  </Drawer>
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