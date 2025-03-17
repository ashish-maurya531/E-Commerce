import api from "./api"

// Get dashboard statistics
const getDashboardStats = async () => {
  const response = await api.get("/dashboard/stats")
  return response.data
}

// Get sales data
const getSalesData = async () => {
  const response = await api.get("/dashboard/sales")
  return response.data
}

// Get category distribution
const getCategoryDistribution = async () => {
  const response = await api.get("/dashboard/categories")
  return response.data
}

// Get top selling products
const getTopProducts = async () => {
  const response = await api.get("/dashboard/top-products")
  return response.data
}

// Get recent orders
const getRecentOrders = async () => {
  const response = await api.get("/dashboard/recent-orders")
  return response.data
}

const dashboardService = {
  getDashboardStats,
  getSalesData,
  getCategoryDistribution,
  getTopProducts,
  getRecentOrders,
}

export default dashboardService

