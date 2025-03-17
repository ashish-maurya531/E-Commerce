import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ConfigProvider } from "antd"
import HomePage from "./pages/HomePage"
import ProductPage from "./admin/pages/Products"
import CartPage from "./admin/pages/CartPage"
import CheckoutPage from "./pages/CheckoutPage"
import TrackOrderPage from "./pages/TrackOrderPage"
import ReturnOrderPage from "./pages/ReturnOrderPage"
import StoreLocatorPage from "./pages/StoreLocatorPage"
import AdminLogin from "./admin/pages/Login"
import AdminDashboard from "./admin/pages/Dashboard"
import AdminProducts from "./admin/pages/Products"
import AdminOrders from "./admin/pages/Orders"
import AdminInventory from "./admin/pages/Inventory"
import AdminUsers from "./admin/pages/Users"
import AdminCategories from "./admin/pages/Categories"
import AdminReports from "./admin/pages/Reports"
import AdminSettings from "./admin/pages/Settings"

// Custom theme configuration for Ant Design
const theme = {
  token: {
    colorPrimary: "#b08d44",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#f5222d",
    colorInfo: "#1677ff",
    borderRadius: 2,
    fontFamily: "Poppins, sans-serif",
  },
}

function App() {
  return (
    <ConfigProvider theme={theme}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/return-order" element={<ReturnOrderPage />} />
          <Route path="/store-locator" element={<StoreLocatorPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </Router>
    </ConfigProvider>
  )
}

export default App

