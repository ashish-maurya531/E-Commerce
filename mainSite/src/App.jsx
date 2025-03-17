import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ConfigProvider } from "antd"
import HomePage from "./pages/HomePage"

import CartPage from "./pages/CartPage"
import CheckoutPage from "./pages/CheckoutPage"
import TrackOrderPage from "./pages/TrackOrderPage"
import ReturnOrderPage from "./pages/ReturnOrderPage"
import StoreLocatorPage from "./pages/StoreLocatorPage"


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
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/return-order" element={<ReturnOrderPage />} />
          <Route path="/store-locator" element={<StoreLocatorPage />} />

          
        </Routes>
      </Router>
    </ConfigProvider>
  )
}

export default App

