import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ConfigProvider, App as AntApp } from "antd"
import Login from "./admin/pages/Login"
import Dashboard from "./admin/pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminProducts from "./admin/pages/Products"
import AdminOrders from "./admin/pages/Orders"
import AdminInventory from "./admin/pages/Inventory"
import AdminUsers from "./admin/pages/Users"
import AdminCategories from "./admin/pages/Categories"
import AdminReports from "./admin/pages/Reports"
import AdminSettings from "./admin/pages/Settings"

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
      <AntApp>
        <Router>
          <Routes>
            {/* Default route redirect */}
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            
            {/* Admin routes */}
            <Route path="/admin">
              <Route path="login" element={<Login />} />
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="products" element={
                <ProtectedRoute>
                  <AdminProducts />
                </ProtectedRoute>
              } />
              <Route path="orders" element={
                <ProtectedRoute>
                  <AdminOrders />
                </ProtectedRoute>
              } />
              <Route path="inventory" element={
                <ProtectedRoute>
                  <AdminInventory />
                </ProtectedRoute>
              } />
              <Route path="users" element={
                <ProtectedRoute>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="categories" element={
                <ProtectedRoute>
                  <AdminCategories />
                </ProtectedRoute>
              } />
              <Route path="reports" element={
                <ProtectedRoute>
                  <AdminReports />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              } />
              
              {/* Catch all admin routes */}
              <Route path="*" element={<Navigate to="/admin/login" replace />} />
            </Route>
            
            {/* Catch all other routes */}
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </Router>
      </AntApp>
    </ConfigProvider>
  )
}

export default App

