const { dashboardData } = require("../data/dashboard")
const { orders } = require("../data/orders")
const { products } = require("../data/products")
const { users } = require("../data/users")

// Get dashboard statistics
const getDashboardStats = (req, res) => {
  try {
    // Calculate real-time stats
    const totalSales = orders.reduce((sum, order) => sum + order.amount, 0)
    const totalOrders = orders.length
    const totalProducts = products.length
    const totalCustomers = users.filter((user) => user.role === "customer").length

    // Calculate percentage increases (dummy data for now)
    const stats = {
      totalSales,
      totalOrders,
      totalProducts,
      totalCustomers,
      increases: {
        sales: 15.2,
        orders: 8.5,
        products: 3.2,
        customers: 12.7,
      },
    }

    res.status(200).json(stats)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get sales data
const getSalesData = (req, res) => {
  try {
    res.status(200).json(dashboardData.salesData)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get category distribution
const getCategoryDistribution = (req, res) => {
  try {
    res.status(200).json(dashboardData.categoryData)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get top selling products
const getTopProducts = (req, res) => {
  try {
    res.status(200).json(dashboardData.topProducts)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get recent orders
const getRecentOrders = (req, res) => {
  try {
    // Get the 5 most recent orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((order) => ({
        id: order.id,
        customer: order.customer,
        date: order.date,
        amount: order.amount,
        status: order.status,
      }))

    res.status(200).json(recentOrders)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getDashboardStats,
  getSalesData,
  getCategoryDistribution,
  getTopProducts,
  getRecentOrders,
}

