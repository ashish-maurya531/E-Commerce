import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import ReturnOrderPage from "./pages/ReturnOrderPage";
import StoreLocatorPage from "./pages/StoreLocatorPage";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ProductDetailPage from "./pages/ProductDetailPage";
import { CartProvider } from "./CartContext.jsx";
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
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <CartProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/category/:categoryName" element={<ProductsPage />} />
          <Route path="/store-locator" element={<StoreLocatorPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/track-order" element={<ProtectedRoute><TrackOrderPage /></ProtectedRoute>} />
          <Route path="/return-order" element={<ProtectedRoute><ReturnOrderPage /></ProtectedRoute>} />

          {/* 404 Route */}
          <Route path="*" element={<h1 style={{ textAlign: "center", marginTop: "100px" }}>404 Not Found</h1>} />
        </Routes>
      </Router>
      </CartProvider>
    </ConfigProvider>
  );
}

export default App;