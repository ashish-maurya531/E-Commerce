const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { verifyToken, isAdmin, isDistributor } = require("../middleware/auth.middleware");

// Get all orders (admin/distributor only)
router.get("/", orderController.getAllOrders);

// Get order history for a user
router.get("/user/history", verifyToken, orderController.getUserOrderHistory);

// Get a single order by ID
router.get("/:id", verifyToken, orderController.getOrderById);

// Create a new order
router.post("/", verifyToken, orderController.createOrder);

// Update order status (admin/distributor only)
router.put("/:id/status", verifyToken, isDistributor, orderController.updateOrderStatus);

// Cancel an order
router.put("/:id/cancel", verifyToken, orderController.cancelOrder);

module.exports = router;

   