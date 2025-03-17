const express = require("express")
const router = express.Router()
const userController = require("../controllers/user.controller")
const { verifyToken, isAdmin } = require("../middleware/auth.middleware")

// Get all users (admin only)
router.get("/", verifyToken, isAdmin, userController.getAllUsers)

// Get a single user by ID (admin only)
router.get("/:id", verifyToken, isAdmin, userController.getUserById)

// Create a new user (admin only)
router.post("/", verifyToken, isAdmin, userController.createUser)

// Update a user (admin only)
router.put("/:id", verifyToken, isAdmin, userController.updateUser)

// Delete a user (admin only)
router.delete("/:id", verifyToken, isAdmin, userController.deleteUser)

module.exports = router

