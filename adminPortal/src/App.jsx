import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom"
import { ConfigProvider } from "antd"
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
      {/* Auto Redirect to /admin */}
      <Route path="/" element={<Navigate to="/admin" />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
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

