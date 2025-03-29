const express = require("express")
const router = express.Router()
const inventoryController = require("../controllers/inventory.controller")
const { verifyToken, isAdmin, isFranchiser } = require("../middleware/auth.middleware")

// // Get inventory status (admin/franchiser only)
// router.get("/", verifyToken, isFranchiser, inventoryController.getInventoryStatus)

// // Get inventory history for a product (admin/franchiser only)
// router.get("/:productId/history", verifyToken, isFranchiser, inventoryController.getProductInventoryHistory)

// // Adjust inventory (admin/franchiser only)
// router.post("/adjust", verifyToken, isFranchiser, inventoryController.adjustInventory)

// // Get low stock items (admin/franchiser only)
// router.get("/low-stock", verifyToken, isFranchiser, inventoryController.getLowStockItems)

module.exports = router

