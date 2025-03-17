const express = require("express")
const router = express.Router()
const dashboardController = require("../controllers/dashboard.controller")
const { verifyToken, isAdmin } = require("../middleware/auth.middleware")

// Get dashboard statistics (admin only)
router.get("/stats", verifyToken, isAdmin, dashboardController.getDashboardStats)

// Get sales data (admin only)
router.get("/sales", verifyToken, isAdmin, dashboardController.getSalesData)

// Get category distribution (admin only)
router.get("/categories", verifyToken, isAdmin, dashboardController.getCategoryDistribution)

// Get top selling products (admin only)
router.get("/top-products", verifyToken, isAdmin, dashboardController.getTopProducts)

// Get recent orders (admin only)
router.get("/recent-orders", verifyToken, isAdmin, dashboardController.getRecentOrders)

module.exports = router

