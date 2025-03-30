const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/adminAuth.controller");

// Middleware for verifying admin token
const { verifyToken } = require("../middleware/auth.middleware")

// Admin login
router.post("/login", adminAuthController.login);

// Admin logout
router.post("/logout", adminAuthController.logout);
router.get("/profile", verifyToken, adminAuthController.getProfile)
//refresh token 
router.post("/refresh-token", adminAuthController.refreshToken);

module.exports = router;