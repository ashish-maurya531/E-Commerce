const express = require("express")
const router = express.Router()
const categoryController = require("../controllers/category.controller")
const { verifyToken, isAdmin } = require("../middleware/auth.middleware")

// Get all categories (public)
router.get("/", categoryController.getAllCategories)

// Get a single category by ID (public)
router.get("/:id", categoryController.getCategoryById)

// Create a new category (admin only)
router.post("/", verifyToken, isAdmin, categoryController.createCategory)

// Update a category (admin only)
router.put("/:id", verifyToken, isAdmin, categoryController.updateCategory)

// Delete a category (admin only)
router.delete("/:id", verifyToken, isAdmin, categoryController.deleteCategory)

module.exports = router

