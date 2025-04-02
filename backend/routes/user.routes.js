const express = require("express")
const router = express.Router()
const userController = require("../controllers/user.controller")
const { verifyToken, isAdmin,isUser } = require("../middleware/auth.middleware")

// Get all users (admin only)
router.get("/", verifyToken,isAdmin, userController.getAllUsers)
router.put("/:id", verifyToken, isAdmin, userController.updateUser)
router.delete("/:id", verifyToken, isAdmin, userController.deleteUser)




router.post("/",userController.createUser)
///send otp 
router.post("/send-otp", userController.sendOtp)
///verify otp
router.post("/verify-otp", userController.verifyOtp)

router.get("/getUser",userController.getUserById)

router.put("/user-profile", verifyToken,isUser, userController.updateUserProfile)

///user login 
router.post("/user-login", userController.userLogin)
///user logout
router.post("/user-logout", userController.userLogout)
//user refresh token 
router.post("/user-refresh-token", userController.user_refreshToken)

module.exports = router

      