const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Product routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);           // Add product
router.put('/:id', productController.updateProduct);        // Update product
router.delete('/:id', productController.deleteProduct);     // Delete product

// Review routes
router.get('/:id/reviews', productController.getProductReviews);
router.post('/:id/reviews', productController.addReview);

module.exports = router;

