const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")
const { verifyToken } = require("../middleware/auth.middleware")

// Register a new user
router.post("/register", authController.register)

// Login user
router.post("/login", authController.login)

// Refresh token
router.post("/refresh-token", authController.refreshToken)

// Logout user
router.post("/logout", verifyToken, authController.logout)

// Get current user profile
router.get("/profile", verifyToken, authController.getProfile)

module.exports = router

