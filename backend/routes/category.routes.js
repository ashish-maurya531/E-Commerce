const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { categoryUpload } = require('../config/multer');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", verifyToken, isAdmin, categoryUpload.single('image'), categoryController.createCategory);
router.put("/:id", verifyToken, isAdmin, categoryUpload.single('image'), categoryController.updateCategory);
router.delete("/:id", verifyToken, isAdmin, categoryController.deleteCategory);

module.exports = router;

