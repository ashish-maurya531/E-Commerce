import { Link } from "react-router-dom"
import { Layout, Menu, Badge, Input, Typography, Space } from "antd"
import { ShoppingCartOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons"

const { Header } = Layout
const { Search } = Input
const { Text } = Typography

const AppHeader = () => {
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
            <Badge count={2}>
              <ShoppingCartOutlined style={{ fontSize: "24px", color: "#000" }} />
            </Badge>
          </Link>
          <SearchOutlined style={{ fontSize: "24px", color: "#000" }} />
          <Link to="/account">
            <UserOutlined style={{ fontSize: "24px", color: "#000" }} />
          </Link>
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

