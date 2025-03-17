const express = require("express")
const router = express.Router()
const productController = require("../controllers/product.controller")
const { verifyToken, isAdmin, isFranchiser } = require("../middleware/auth.middleware")

// Get all products (public)
router.get("/", productController.getAllProducts)

// Get a single product by ID (public)
router.get("/:id", productController.getProductById)

// Create a new product (admin/franchiser only)
router.post("/", verifyToken, isFranchiser, productController.createProduct)

// Update a product (admin/franchiser only)
router.put("/:id", verifyToken, isFranchiser, productController.updateProduct)

// Delete a product (admin only)
router.delete("/:id", verifyToken, isAdmin, productController.deleteProduct)

module.exports = router

